import React from 'react';
import {Redirect, withRouter} from "react-router-dom";
import {API, APINoAuthentication, getAndUpdateUserDetails} from '../api';
import {UserContext} from "../contexts";
import compose from "recompose/compose";
import { withSnackbar } from 'notistack';
import { isEmptyObject } from "../utils"
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {sendAnalyticsEventForAjaxRequest, sendAnalyticsException, sendAnalyticsErrorsFromObject} from '../analytics'

const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY

class AjaxRequest extends React.Component {
    intervalTask = null;

    state = {
        redirect: null,
        showBackdrop: false
    }

    onSuccess = (responseData, request, snackbarOptions) => {
        let msg;

        if (this.props.onSuccess) {
           console.log('Calling onSuccess with', responseData)
           this.props.onSuccess(responseData, request, Boolean(this.props.redirectTo));
        }

        if (this.props.getSuccessMessage) {
            msg = this.props.getSuccessMessage(request, responseData);
        }else if (this.props.successMessage) {
            msg = this.props.successMessage;
        }else if (this.props.showSuccessMessage && !isEmptyObject(responseData[responseKey])){
            msg = responseData[responseKey];
        }

        if (msg) {
            console.log('AJAXRequest adding snackbar', msg)
            snackbarOptions = { variant: "success",  ...snackbarOptions}
            this.props.enqueueSnackbar(msg, snackbarOptions);
        }

    }

    getSnackbarOptions = () => {
        let snackbarOptions;
        if (this.props.getSnackbarOptions) snackbarOptions = this.props.getSnackbarOptions(this.props.values);
        else if (this.props.snackbarOptions) snackbarOptions = this.props.snackbarOptions;
        return snackbarOptions;
    }

    sendRequest = async(nonInteraction=true) => {
        let request = {}
        let responseData;
        let msg;
        const values = this.props.values;
        let snackbarOptions = this.getSnackbarOptions();

        try {
            if (this.props.request) request = this.props.request;
            else if (this.props.createRequest) request = this.props.createRequest(values);
            else if (this.props.method === 'GET'){
                request = {
                    method: 'GET',
                    url: this.props.url,
                    params: values,
                }
            }
            else request = {
                method: this.props.method || 'POST',
                url: this.props.url,
                data: values,
            }
            if (this.props.config){
                Object.assign(request, this.props.config)
            }

            if (this.props.adaptRequest) request = this.props.adaptRequest(request);

            console.log("AJAXRequest", request);

            if (!this.props.passive) sendAnalyticsEventForAjaxRequest(request.url, request.method, nonInteraction,
                this.props.analyticsEventArgs);

            let response
            console.log(request.url, "PASSIVE", this.props.passive);
            if (this.props.noAuth) {
                response = await APINoAuthentication(request);
            }else if (this.props.passive){
                console.log('Running AJAXRequest passively')
                API(request);
                return [true, null];
            } else {
                response = await API(request);
            }

            console.log("AjaxRequest Response", response);
            responseData = response.data;

            this.onSuccess(responseData, request, snackbarOptions);

            return [true, responseData];

        }catch (e) {
            console.log(e, typeof e);
            if (typeof e === "string" && (e.includes("Got 401 on token refresh") || e.includes('Resetting auth token:'))){
                // Failed to refresh token
                console.log('Failed to refresh token', e);
                let snackbarOptions = {variant: "error", ...snackbarOptions};
                this.props.enqueueSnackbar('Authentication issue encountered. Please login again.',
                    snackbarOptions);
                return [false, "Token Refresh Failed"];
            }
            if (e.response) {
                let responseData;
                if (e.response.data === Object(e.response.data)) {
                    responseData = e.response.data;
                    sendAnalyticsErrorsFromObject(responseData, this.props.analyticsEventArgs);
                }else{
                    console.log("response", e.response);
                    console.log('errormessage', e.message);
                    sendAnalyticsException(e);
                    responseData = {[responseKey]: e.message};
                    let newWindow = window.open();
                    newWindow.document.write(e.response.data);
                    newWindow.document.close();
                }
                console.log('error response object received');
                snackbarOptions = {variant: "error", ...snackbarOptions}
                const errorMessage = Object.values(responseData).join('\n');
                if (this.props.onError) this.props.onError(responseData, request, snackbarOptions);
                if (!this.props.hideAlertsOnError && responseData) {
                    this.props.enqueueSnackbar(
                        errorMessage, snackbarOptions);
                }
            }else {
                sendAnalyticsException(e);
            }
            console.error(e)
            console.log("Error message", e.message);
            return [false, responseData];
        }
    }

    send = async() => {
        if (this.props.showBackdrop) this.setState({showBackdrop: true});

        console.log('runAtInterval', this.props.interval);
        let redirect;
        let success;
        let responseData;

        if (this.props.redirectTo) redirect = { ...this.props.redirectTo }

        if (this.props.checkLocationState && this.props.location.state && this.props.location.state.data) {
            console.log("AjaxRequest retrieving from location.state.data");
            success = true;
            responseData = this.props.location.state.data;
            let newState = {...this.props.location.state}
            delete newState.data;
            this.props.history.replace({
                pathname: this.props.location.pathname,
                state: newState
            });
            this.onSuccess(responseData, {});

        } else {
            console.log('Sending request to', this.props.url, this.props.method)
            if (this.props.passive){
                this.sendRequest();
                return
            }
            const response = await this.sendRequest(false);
            success = response[0];
            responseData = response[1];
        }

        let userContext = this.context;
        let resetUserDetails = this.props.resetUserDetails;

        if (success) {
            if (this.props.updateUserDetails) {
                setTimeout(getAndUpdateUserDetails, 0, userContext.updater, responseData);
            }
            if (redirect) {
                if (!redirect.state) redirect.state = {}
                if (this.props.addFieldToRedirectPathname) redirect.pathname += responseData[this.props.addFieldToRedirectPathname]
                if (this.props.addResponseToRedirectState) redirect.state.data = responseData;
            }
        } else {
            if (responseData === "Token Refresh Failed"){
                // Redirect to sign-in page if there was an issue refreshing access token
                console.log('Resetting user details and redirecting to login');
                resetUserDetails = true;
                redirect = {
                    pathname: "/sign-in"
                }
            }
            else if (!this.props.reDirectOnError) redirect = null;
        }

        console.log('resetUserDetails', this.props.resetUserDetails);
        if (resetUserDetails){
               setTimeout(userContext.reset, 0);
        }

        console.log('AJAXRequest redirectState', redirect);
        if (redirect) this.setState({redirect: redirect});
        else if (this.props.showBackdrop) this.setState({showBackdrop: false});
    }

    async componentDidMount(){
        console.log('Mounting AJAXRequest');
        if (!this.props.noImmediateRequest) await this.send();
        console.log('runAtInterval', this.props.runAtInterval);
        if (this.props.runAtInterval) this.intervalTask = setInterval(this.sendRequest, this.props.runAtInterval);
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
                <Backdrop open={this.state.showBackdrop}>
                        <CircularProgress color="inherit" />
                </Backdrop>
            </React.Fragment>
        )
    }
}


AjaxRequest.contextType = UserContext;


export default compose(
  withRouter,
  withSnackbar
)(AjaxRequest);