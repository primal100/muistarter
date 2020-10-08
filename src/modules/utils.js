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


export const isEmptyObject = (obj) => {
    return (obj.constructor === Object && Object.keys(obj).length === 0) || (Array.isArray(obj) && obj.length === 0)
}


export const nullOrEmptyObject = (obj) => {
    return (!obj || isEmptyObject(obj))
}

export const parseBool = (str) =>{
    if (str) return JSON.parse(str.toLowerCase());
    return false;
}
