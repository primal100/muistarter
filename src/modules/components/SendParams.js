import React from 'react';
import { API } from '../api';
import {Redirect} from "react-router-dom";
import { withRouter } from "react-router-dom";
import {paramsToObject} from "../utils";


const response_key = process.env.REACT_APP_GENERAL_ERRORS_KEY


class SendParams extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          redirectState: {},
      }
    };
    async sendParams() {
        const values = paramsToObject(this.props);
        const redirectState = {};
        console.log(values);
        try {
            let response = await API({
                method: this.props.method || 'POST',
                url: this.props.url,
                data: values
            })
            console.log(response.data);
            redirectState.successMessages = [response.data[response_key]];
        }catch (e) {
            const data = e.response.data;
            console.log(data);
            redirectState.errorMessages = Object.values(data);
        }
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

export default withRouter(SendParams);