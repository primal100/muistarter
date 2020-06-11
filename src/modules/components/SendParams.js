import React from 'react';
import { API } from '../api';
import {Redirect} from "react-router-dom";
import { withRouter } from "react-router-dom";


class SendParams extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          redirectState: {},
      }
    };
    async sendParams() {
        const params = new URLSearchParams(this.props.location.search);
        const values = {
            user_id: params.get('user_id'),
            timestamp: params.get('timestamp'),
            signature: params.get('signature')
            }
        const redirectState = {};
        try {
            await API({
                method: this.props.method || 'POST',
                url: this.props.url,
                data: values
            })
            redirectState.successMessages = ["Your e-mail address has been verified. Please sign-in below."];
        }catch (e) {
            const data = e.response.data;
            redirectState.errorMessages = Object.values(data);
            redirectState.errorMessages[0] += '. Please check again the link in the email you received.'
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