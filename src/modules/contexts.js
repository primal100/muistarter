import React from "react";

export const UserContext = React.createContext({user: null, updater: null});
UserContext.displayName = "UserContext"

export const AlertContext = React.createContext({addAlert: null, removeAlert: null, replaceAlert: null});
AlertContext.displayName = "AlertContext"


export function withAlerts(Component) {
    return class extends React.Component {
        render() {
            return (
                <AlertContext.Consumer>
                    {({addAlert, removeAlert, replaceAlert}) => (
                        <Component addAlert={addAlert} removeAlert={removeAlert}
                                   replaceAlert={replaceAlert} {...this.props}/>
                    )}
                </AlertContext.Consumer>
            )
        }
    }
}