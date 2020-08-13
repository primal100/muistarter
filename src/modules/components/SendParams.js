import React from 'react';
import {API, getAndUpdateUserDetails} from '../api';
import compose from 'recompose/compose';
import {Redirect} from "react-router-dom";
import { withRouter } from "react-router-dom";
import {propsParamsToObject} from "../utils";
import {UserContext} from "../contexts";
import { withAlerts } from "../contexts"


const responseKey = process.env.REACT_APP_GENERAL_ERRORS_KEY


class SendParams extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          redirectState: {},
          alerts: [],
      }
    };
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
            msgs = [{message: response.data[responseKey], severity: "success"}];
            console.log("msgs", msgs);
        }catch (e) {
            const data = e.response.data;
            redirectState.errorMessages = Object.values(data);
            msgs = Object.values(data).map(msg => {return {message: msg, severity: "error"}})
        }
        redirectState.refreshUserDetails = true;
        let userContext = this.context;
        await getAndUpdateUserDetails(userContext.updater);
        this.setState({redirectState: redirectState, alerts: msgs});
    }

    async componentDidMount() {
        await this.sendParams();
    }

    render() {
        if (Object.keys(this.state.redirectState).length !== 0){
            const redirect = {
                pathname: this.props.redirectTo,
                state: this.state.redirectState
        }
        this.state.alerts.forEach(alert => this.props.addAlert(alert.message, alert.severity));
        return (
            <Redirect to={redirect} />
            );
        }else{
          return (<div/>)
      }
    }
}

SendParams.contextType = UserContext;

export default compose(
  withRouter,
  withAlerts
)(SendParams);