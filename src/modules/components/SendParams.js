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
    async componentDidMount() {
        console.log('running componentDidMount()')
        const params = new URLSearchParams(this.props.location.search);
        const values = {
            user_id: params.get('user_id'),
            timestamp: params.get('timestamp'),
            signature: params.get('signature')
            }
        console.log(values);
        try {
            let response = await API({
                method: this.props.method || 'POST',
                url: this.props.url,
                data: values
            })
            const data = response.data;
            console.log("Setting state", data)
            this.setState({redirectState: {successMessages: Object.values(data)}});
            console.log("State set")
        }catch (e) {
            const data = e.response.data;
            console.log(data)
            this.setState({redirectState: {errorMessages: Object.values(data)}});
        }
        console.log('ComponentDidMount finished')
    }

    render() {
      if (this.state.redirectState && this.state.redirectState !== {}){
          const redirect = {
            pathname: this.props.redirectTo,
            state: this.state.redirectState
        }
        return (
            <Redirect to={redirect} />
            );
        }else{
          return (<div></div>)
      }
    }
}

export default withRouter(SendParams);