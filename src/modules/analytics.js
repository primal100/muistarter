import ReactGA from 'react-ga';
import { parseBool } from "./utils"


const trackingID = process.env.REACT_APP_ANALYTICS_TRACKING_ID
const trackingDebugMode = parseBool(process.env.REACT_APP_ANALYTICS_DEBUG_MODE);
const trackingTestMode = parseBool(process.env.REACT_APP_ANALYTICS_TEST_MODE);


export const initializeGATracker = () => {
    if (trackingID) {
        ReactGA.initialize(trackingID, {
            debug: trackingDebugMode,
            testMode: trackingTestMode
        });
        console.log('Initialized Google Analytics with trackingID', trackingID);
        return true;
    }
}

export const setGAUserDetails = (user) =>{
    if (gaEnabled) ReactGA.set({
        userId: user.id
    })
}


export const setGAFields = (fields) => {
    if (gaEnabled) ReactGA.set(fields);
}


export const pageViewGA = (path) => {
    if(gaEnabled) {
        path = path || window.location.pathname + window.location.search;
        ReactGA.pageview(path);
        console.log('Sent pageview');
    }
}


export const sendGAError = (msg) => {
  if (gaEnabled) ReactGA.exception({
    description: msg,
    fatal: false
});
}


const sendGAErrorFromFieldValue = (baseMsg, field, value) => {
    const msg = `${baseMsg}${field}: ${value}`;
    sendGAError(msg);
}


export const sendGAErrorsFromObject = (errorsObj, eventArgs) => {
    let baseMsg = '';
    if (eventArgs && eventArgs.action) baseMsg = `${eventArgs.action}: `
       Object.keys(errorsObj).forEach(field => {
           let value = errorsObj[field];
           if (Array.isArray(value)){
               value.forEach(v => {
                   sendGAErrorFromFieldValue(baseMsg, field, v);
               })
           }else{
               sendGAErrorFromFieldValue(baseMsg, field, value);
           }

       })
}

export const sendGAException = (error) => {
    if (gaEnabled) sendGAError(error.message);
}

export const sendGAModalView = (name) => {
    if (gaEnabled) ReactGA.modalview(name);
}


export const sendGAOutboundLink = (label) => {
    if (gaEnabled) ReactGA.outboundLink({label: label});
}

export const sendGAEvent = (EventArgs) => {
    if (gaEnabled) ReactGA.event(EventArgs);
}

export const sendGAEventForAjaxRequest = (url, method, nonInteraction, EventArgs) =>{
    EventArgs = EventArgs || {};
    const eventObj = {
        category: url,
        action: method,
        nonInteraction: nonInteraction,
        ...EventArgs,
    }
    if (! eventObj.nonInteraction) delete eventObj.nonInteraction;
    sendGAEvent(eventObj);
}


export const gaEnabled = initializeGATracker();
pageViewGA();