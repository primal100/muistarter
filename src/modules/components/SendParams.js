import React from 'react';
import {API, getAndUpdateUserDetails} from '../api';
import {Redirect} from "react-router-dom";
import { withRouter } from "react-router-dom";
import {paramsToObject} from "../utils";
import {UserContext} from "../contexts";


const response_key = process.env.REACT_APP_GENERAL_ERRORS_KEY


class SendParams extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          redirectState: {},
      }
    };
    async sendParams() {
        console.log("Running sendParams component @ " + window.location.pathname);
        const values = paramsToObject(this.props);
        const redirectState = {};
        try {
            let response = await API({
                method: this.props.method || 'POST',
                url: this.props.url,
                data: values
            })
            redirectState.successMessages = [response.data[response_key]];
        }catch (e) {
            const data = e.response.data;
            redirectState.errorMessages = Object.values(data);
        }
        redirectState.refreshUserDetails = true;
        let userContext = this.context;
        await getAndUpdateUserDetails(userContext.updater);
        this.setState({redirectState: redirectState});
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
        return (
            <Redirect to={redirect} />
            );
        }else{
          return (<div/>)
      }
    }
}

SendParams.contextType = UserContext;
export default withRouter(SendParams);