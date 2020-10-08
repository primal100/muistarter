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
        userId: user.id,
        is_staff: user.is_staff
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

export const sendGAException = (error) => {
    if (gaEnabled) sendGAError(error.message);
}

export const sendGAModalView = (name) => {
    if (gaEnabled) ReactGA.modalview(name);
}


export const sendGAOutboundLink = (label) => {
    if (gaEnabled) ReactGA.outboundLink(label);
}

export const gaEnabled = initializeGATracker();
if (gaEnabled) pageViewGA();