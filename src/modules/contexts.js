import React from "react";

export const UserContext = React.createContext({user: null, updater: null, reset: null});
UserContext.displayName = "UserContext"
