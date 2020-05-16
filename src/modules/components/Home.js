import withRoot from '../withRoot';
// --- Post bootstrap -----
import React from 'react';
import Typography from './Typography';
import AppForm from '../views/AppForm';


function Home() {

  return (
    <React.Fragment>
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Home
          </Typography>
        </React.Fragment>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(Home);
