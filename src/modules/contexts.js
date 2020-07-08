import React from "react";

export const UserContext = React.createContext({values: null, updater: null});
UserContext.displayName = "UserContext"