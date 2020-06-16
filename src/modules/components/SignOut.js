import React from 'react';
import { logout } from '../api';
import { withRouter } from "react-router-dom";


class SignOut extends React.Component {
    async componentDidMount() {
        await logout();
    }

    render(){
        return (<div/>)
    }
}

export default withRouter(SignOut);