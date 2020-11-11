import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from "react-router-dom";
import {propsParamsToObject} from "../utils";
import AjaxRequest from "./AjaxRequest"


class SendParams extends React.Component {

    render() {
        const values = propsParamsToObject(this.props);

        const redirect = {
              pathname: this.props.redirectTo,
        }

        return (
           <AjaxRequest url={this.props.url} method={this.props.method} showSuccessMessage noAuth
                   values={values} updateUserDetails redirectTo={redirect} reDirectOnError
           analyticsEventArgs={{category: 'User', action: this.props.action || 'Sending URL params', label:'PageLoad',
               nonInteraction: true}}/>
        )
    }
}


export default compose(
  withRouter,
)(SendParams);