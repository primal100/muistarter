import React from "react";
import {getAndUpdateUserDetails, updateUserFromCurrentAccessToken} from "./api";
import {setAnalyticsUserDetails} from "./analytics";

export const UserContext = React.createContext({user: null, updater: null, reset: null, userChecked: false});
UserContext.displayName = "UserContext"


export class SetUserContext extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userDetails: {user: null, updater: this.updateUserDetails, reset: this.resetUserDetails, userChecked: false}
        }
    }

    async componentDidMount() {
        updateUserFromCurrentAccessToken(this.updateUserDetails);
        await getAndUpdateUserDetails(this.updateUserDetails);
    }

    updateUserDetails = (user) => {
        console.log('Updating user details', user);
        if(user && user.email) {
            setAnalyticsUserDetails(user);
            this.setState({userDetails: {user: user, updater: this.updateUserDetails,
                    reset: this.resetUserDetails, userChecked: true}});
        }
    }

    resetUserDetails = () => {
        console.log('Resetting user details');
        this.setState({userDetails: {user: null, updater: this.updateUserDetails,
                reset: this.resetUserDetails, userChecked: true}});
    }

    render() {
        return (
            <UserContext.Provider value={this.state.userDetails}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}
