import React from 'react';
import {API, getAndUpdateUserDetails} from '../api';
import compose from 'recompose/compose';
import { withRouter } from "react-router-dom";
import {propsParamsToObject} from "../utils";
import AjaxRequest from "./AjaxRequest"


const responseKey = process.env.REACT_APP_GENERAL_ERRORS_KEY


class SendParams extends React.Component {

    async sendParams() {
        console.log("Running sendParams component @ " + window.location.pathname);
        const values = propsParamsToObject(this.props);
        const redirectState = {};
        let msgs = [];
        try {
            let response = await API({
                method: this.props.method || 'POST',
                url: this.props.url,
                data: values
            })
            console.log("msgs", msgs);
            this.props.addAlert(response.data[responseKey], "success");
        }catch (e) {
            const data = e.response.data;
            this.props.addAlert(Object.values(data).join('\n'), "error");
        }
        redirectState.refreshUserDetails = true;
        let userContext = this.context;
        await getAndUpdateUserDetails(userContext.updater);
        this.setState({redirectState: redirectState});
    }

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

//SendParams.contextType = UserContext;

export default compose(
  withRouter,
)(SendParams);