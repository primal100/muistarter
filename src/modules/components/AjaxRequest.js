import React from 'react';
import {Redirect, withRouter} from "react-router-dom";
import {API, APINoAuthentication, getAndUpdateUserDetails} from '../api';
import {UserContext} from "../contexts";
import compose from "recompose/compose";
import { withSnackbar } from 'notistack';
import { isEmptyObject } from "../utils"

const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY

class AjaxRequest extends React.Component {
    intervalTask = null;

    state = {
        redirect: null,
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

    sendOneRequest = async(values) => {
        let request = {}
        let responseData;
        let msg;
        let snackbarOptions = {};
        if (this.props.getSnackbarOptions) snackbarOptions = this.props.getSnackbarOptions(values);
        else if (this.props.snackbarOptions) snackbarOptions = this.props.snackbarOptions;

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
            let response
            if (this.props.noAuth) {
                response = await APINoAuthentication(request);
            } else {
                response = await API(request);
            }
            console.log("AjaxRequest Response", response);
            responseData = response.data;

            this.onSuccess(responseData, request, snackbarOptions);

            return [true, responseData];

        }catch (e) {
            if (e.response) {
                responseData = e.response.data;
                snackbarOptions = {variant: "error", ...snackbarOptions}
                if (this.props.onError) this.props.onError(responseData, request, snackbarOptions);
                if (!this.props.hideAlertsOnError && responseData) {
                    this.props.enqueueSnackbar(
                        Object.values(responseData).join('\n'), snackbarOptions);
                }
            }
            console.error(e)
            return [false, responseData];
        }
    }

    sendRequests = async() => {
        console.log('runAtInterval', this.props.interval);
        let redirect;
        let result;
        let allResponseData;

        if (this.props.redirectTo) redirect = { ...this.props.redirectTo }

        if (this.props.checkLocationState && this.props.location.state && this.props.location.state.data) {
            console.log("AjaxRequest retrieving from location.state.data");
            result = "success";
            allResponseData = this.props.location.state.data;
            let newState = {...this.props.location.state}
            delete newState.data;
            this.props.history.replace({
                pathname: this.props.location.pathname,
                state: newState
            });
            allResponseData.forEach(data => this.onSuccess(data, {}))

        }else {
            let valuesList;
            if (this.props.valuesList) {
                valuesList = this.props.valuesList;
            } else {
                valuesList = [this.props.values];
            }
            const responses = await Promise.all(valuesList.map(values => this.sendOneRequest(values)));
            if (responses.every(response => response[0])) result = "success";
            else if (responses.some(response => response[0])) result = "info";
            else result = "error";
            allResponseData = responses.map(response => response[1]);
        }

        if (this.props.onAllComplete) {
            console.log('Calling onAllComplete with', allResponseData, result)
            this.props.onAllComplete(allResponseData, result);
        }

        if (result === "success") {

            if (this.updateUserDetails) {
                let userContext = this.context;
                await getAndUpdateUserDetails(userContext.updater);
            }

            if (redirect) {
                if (!redirect.state) redirect.state = {}
                if (this.props.addFieldToRedirectPathname) redirect.pathname += allResponseData[0][this.props.addFieldToRedirectPathname]
                if (this.props.addResponseToRedirectState) redirect.state.data = allResponseData;
            }
        } else {
            if (!this.props.reDirectOnError) redirect = null;
        }

        if (this.props.getAllCompleteMessage) {
            let msg = this.props.getAllCompleteMessage(result, allResponseData);
            if (msg) {
                console.log('AJAXRequest adding alert', msg)
                this.props.enqueueSnackbar(msg, {variant: result});
            }
        }

        console.log('AJAXRequest redirectState', redirect);
        if (redirect) this.setState({redirect: redirect});
    }

    async componentDidMount(){
        console.log('Mounting AJAXRequest')
        await this.sendRequests();
        console.log('runAtInterval', this.props.runAtInterval);
        if (this.props.runAtInterval) this.intervalTask = setInterval(this.sendRequests, this.props.runAtInterval);
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
  withSnackbar
)(AjaxRequest);