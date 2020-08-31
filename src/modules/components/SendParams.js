import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from "react-router-dom";
import {propsParamsToObject} from "../utils";
import AjaxRequest from "./AjaxRequest"


class SendParams extends React.Component {

    render() {
        console.log("Running sendParams component @ " + window.location.pathname);
        const values = propsParamsToObject(this.props);

        const redirect = {
              pathname: this.props.redirectTo,
        }

        return (
           <AjaxRequest url={this.props.url} method={this.props.method} showSuccessMessage
                   values={values} updateUserDetails redirectTo={redirect} reDirectOnError/>
        )
    }
}


export default compose(
  withRouter,
)(SendParams);