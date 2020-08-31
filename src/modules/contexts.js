import React from "react";

export const UserContext = React.createContext({user: null, updater: null, reset: null});
UserContext.displayName = "UserContext"

export const AlertContext = React.createContext({addAlert: null, addToAlertText: null,
    setAlertContent: null});
AlertContext.displayName = "AlertContext"


export function withAlerts(Component) {
    return class extends React.Component {
        render() {
            return (
                <AlertContext.Consumer>
                    {({addAlert, addToAlertText, setAlertContent}) => (
                        <Component addAlert={addAlert} addToAlertText={addToAlertText}
                                   setAlertContent={setAlertContent} {...this.props}/>
                    )}
                </AlertContext.Consumer>
            )
        }
    }
}
