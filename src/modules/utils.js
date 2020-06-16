export const changeLocationState = (props, newState) => {
   let state = props.location.state || {};
   let stateCopy = { ...state, ...newState };
   props.history.replace({state: stateCopy})
}


export const paramsToObject = (props) => {
      const entries = new URLSearchParams(props.location.search).entries();
      let values = {}
      for (let entry of entries) {
         const [key, value] = entry;
         values[key] = value;
      }
      return values;
}