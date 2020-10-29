import React from "react";
import {getAndUpdateUserDetails, updateUserFromCurrentAccessToken} from "./api";
import {setAnalyticsUserDetails} from "./analytics";

export const UserContext = React.createContext({user: null, updater: null, reset: null,
    userChecked: false, preferences: null, setExtra: null});
UserContext.displayName = "UserContext"


const getPreferences = () => localStorage.getItem('preferences');

export class SetUserContext extends React.Component {

    constructor(props) {
        super(props);
        this.defaultUserDetails = {user: null, updater: this.updateUserDetails, reset: this.resetUserDetails,
            userChecked: false, preferences: getPreferences(), setExtra: this.setExtra}
        this.state = {
            userDetails: this.defaultUserDetails
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
            this.setState({userDetails: {...this.state.userDetails, user: user, userChecked: true}});
        }
    }

    refreshPreferences = (user) => {
        console.log('Refreshing Preferences', user);
        if(user && user.email) {
            this.setState({userDetails: {...this.state.userDetails, preferences: getPreferences()}});
        }
    }

    setExtra = (obj) => {
        console.log('Setting user extra', obj);
        setTimeout(() => this.setState({userDetails: {...this.state.userDetails, ...obj}}), 0);
    }

    resetUserDetails = () => {
        console.log('Resetting user details');
        this.setState({userDetails: {...this.defaultUserDetails, preferences: null, userChecked: true}});
    }

    render() {
        return (
            <UserContext.Provider value={this.state.userDetails}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}
