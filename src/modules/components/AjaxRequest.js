import React from 'react';
import {Redirect, withRouter} from "react-router-dom";
import {API, getAndUpdateUserDetails} from '../api';
import {UserContext, withAlerts} from "../contexts";
import compose from "recompose/compose";


const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY


class AjaxRequest extends React.Component {
    intervalTask = null;

    state = {
        redirect: null,
    }

    send = async() => {
        console.log('runAtInterval', this.props.interval);
        let request;
        let redirect;
        let reDirected;

        if (this.props.redirectTo) redirect = { ...this.props.redirectTo }

        if (this.props.request) request = this.props.request;
        else if (this.props.createRequest) request = this.props.createRequest(this.props.values);
        else if (this.props.method === 'GET'){
            request = {
                method: 'GET',
                url: this.props.url,
                params: this.props.values,
                config: this.props.config
            }
        }
        else request = {
            method: this.props.method || 'POST',
            url: this.props.url,
            data: this.props.values,
            config: this.props.config
        }
        if (this.props.adaptRequest) request = this.props.adaptRequest(request);
        console.log("AJAXRequest", request);


        try {
            let data;
            let msg;

            if (this.props.checkLocationState && this.props.location.state && this.props.location.state.data){
                console.log("AjaxRequest Retrieving data from location.state,data");
                data = this.props.location.state.data;
                let newState = {...this.props.location.state}
                delete newState.data;
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: newState
                });

            } else {
                let response = await API(request);
                console.log("AjaxRequest Response", response);
                data = response.data;
            }

            if (this.props.getSuccessMessage) {
                msg = this.props.getSuccessMessage(request, data);
            }else if (this.props.successMessage) {
                msg = this.props.successMessage;
            }else if (this.props.showSuccessMessage && data[responseKey] && data[responseKey].length > 0){
                msg = data[responseKey];
            }

            console.log('AJAXRequest adding alert', msg)

            this.props.addAlert(msg, "success");

            if (this.updateUserDetails){
                let userContext = this.context;
                await getAndUpdateUserDetails(userContext.updater);
            }

            if (redirect) {
                reDirected = true;
                if (!redirect.state) redirect.state = {}
                if (this.props.addFieldToRedirectPathname) redirect.pathname += data[this.props.addFieldToRedirectPathname]
                if (this.props.addResponseToRedirectState) redirect.state.data = data;
            }

            if (this.props.onSuccess) {
                console.log('Calling onSuccess with', data)
                this.props.onSuccess(data, request, reDirected);
            }

        }catch (e) {
            if (! e.response){
                throw e
            }
            let data = e.response.data;
            if (this.props.onError) this.props.onError(data, request);
            if (!this.props.hideAlertsOnError) this.props.addAlert(Object.values(data).join('\n'), "error");
            if (!this.props.reDirectOnError) redirect = null;
        }

        console.log('AJAXRequest redirectState', redirect);

        if (redirect) this.setState({redirect: redirect});
    }

    async componentDidMount(){
        console.log('Mounting AJAXRequest')
        await this.send();
        console.log('runAtInterval', this.props.runAtInterval);
        if (this.props.runAtInterval) this.intervalTask = setInterval(this.send, this.props.runAtInterval);
    }

    async componentWillUnmount(){
        if (this.intervalTask){
            clearInterval(this.intervalTask);
        }
        console.log('AJAXRequest Unmounted')
    }

    render(){
        console.log('Rendering AJAXRequest');
        return (
            <React.Fragment>
                {this.state.redirect &&
                    <Redirect to={this.state.redirect}/>
                }
            </React.Fragment>
        )
    }
}


AjaxRequest.contextType = UserContext;


export default compose(
  withRouter,
  withAlerts
)(AjaxRequest);