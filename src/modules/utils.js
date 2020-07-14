export const changeLocationState = (props, newState) => {
   let state = props.location.state || {};
   let stateCopy = { ...state, ...newState };
   props.history.replace({state: stateCopy})
}


export const paramsToObject = (url) => {
      const entries = new URLSearchParams(url).entries();
      let values = {}
      for (let entry of entries) {
         const [key, value] = entry;
         values[key] = value;
      }
      return values;
}


export const propsParamsToObject = (props) => {
    return paramsToObject(props.location.search);
}

export const isPageRefreshed = () => {
    console.log(window.performance)
    console.log(performance.navigation.type);
    return window.performance && performance.navigation.type === 1;
}
