import React from 'react';
import ReactMarkdown from "react-markdown";
import AjaxRequest from "./AjaxRequest";
import {withStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box"



const useStyles = (theme) => ({
  [theme.breakpoints.up('md')]: {
    root: {
      padding: theme.spacing(4),
    }
  },
});


class MarkdownFileView extends React.Component {
    state = {
        text: 'Loading...'
    }

    setText = (response) => {
        console.log('setting state')
        this.setState({ text: response })
    }

    render() {
        const { classes } = this.props;
        console.log('Text', this.state.text)
        return (
            <Box className={classes.root}>
            <AjaxRequest method="GET" url={this.props.url} onSuccess={this.setText} showBackdrop/>
                <ReactMarkdown>
                    {this.state.text}
                </ReactMarkdown>
            </Box>
        )
    }
}

export default withStyles(useStyles)(MarkdownFileView);
