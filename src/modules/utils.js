export const changeLocationState = (props, newState) => {
   let state = props.location.state || {};
   let stateCopy = { ...state, ...newState };
   props.history.replace({state: stateCopy})
}
