import express from 'express';
import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter as Router} from "react-router-dom";
import { ServerStyleSheets } from '@material-ui/core/styles';
import App from './App';
import {selector} from "./index";

const buildDir = 'lib'

function handleRender(req, res) {
  const sheets = new ServerStyleSheets();

  // Render the component to a string.
  const html = ReactDOMServer.renderToString(
    sheets.collect(
        <Router>
        <App />
        </Router>
    ),
  );

  // Grab the CSS from the sheets.
  const css = sheets.toString();

  // Send the rendered page back to the client.
  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Internal server error');
    }

    data = data.replace(`<div id="${selector}"></div>`, `<div id="${selector}">${html}</div>`)

    data = data.replace('<style id="jss-server-side"/>',
        `<style id="jss-server-side">${css}</style>`)

    res.send(data);
  });
}

const app = express();

app.use('/build', express.static(buildDir));

// This is fired every time the server-side receives a request.
app.use(handleRender);

const port = process.env.PORT || 3000;
app.listen(port);