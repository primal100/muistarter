import React from 'react';
import ReactGA from 'react-ga';
import { Button} from "@material-ui/core";
import { withSnackbar} from "notistack";
import { parseBool } from "./utils"
import AjaxRequest from "./components/AjaxRequest";
import { UserContext } from "./contexts"
import {NoSsr} from "@material-ui/core/NoSsr";


const visitUrl = process.env.REACT_APP_VISIT_URL;
const trackingID = process.env.REACT_APP_ANALYTICS_TRACKING_ID
const trackingDebugMode = parseBool(process.env.REACT_APP_ANALYTICS_DEBUG_MODE);
const trackingTestMode = parseBool(process.env.REACT_APP_ANALYTICS_TEST_MODE);
const encryptionKey = process.env.REACT_APP_ANALYTICS_ENCRYPTION_KEY;
const showCookieWarning = parseBool(process.env.REACT_APP_SHOW_COOKIE_WARNING);
const cookieWarningText = process.env.REACT_APP_COOKIE_WARNING_TEXT ||
    "This site uses cookies in order to provide and secure our website";


const consentKey = "CookieConsent";

let analyticsEnabled = false;


export const initializeAnalyticsTracker = (hasConsent) => {
    hasConsent = hasConsent || JSON.parse(localStorage.getItem(consentKey));
    if (!analyticsEnabled && trackingID && hasConsent) {
        ReactGA.initialize(trackingID, {
            debug: trackingDebugMode,
            testMode: trackingTestMode
        });
        analyticsEnabled = true;
        pageViewAnalytics();
    }
}

export const setAnalyticsUserDetails = (user) =>{
    if (analyticsEnabled) ReactGA.set({
        userId: user.id
    })
}


export const setAnalyticsFields = (fields) => {
    if (analyticsEnabled) ReactGA.set(fields);
}


export const pageViewAnalytics = (path) => {
    if(analyticsEnabled) {
        path = path || window.location.pathname;
        ReactGA.pageview(path);
    }
}


export const sendAnalyticsError = (msg) => {
  if (analyticsEnabled) ReactGA.exception({
    description: msg,
    fatal: false
});
}


const sendAnalyticsErrorFromFieldValue = (baseMsg, field, value) => {
    const msg = `${baseMsg}${field}: ${value}`;
    sendAnalyticsError(msg);
}


export const sendAnalyticsErrorsFromObject = (errorsObj, eventArgs) => {
    let baseMsg = '';
    if (eventArgs && eventArgs.action) baseMsg = `${eventArgs.action}: `
       Object.keys(errorsObj).forEach(field => {
           let value = errorsObj[field];
           if (Array.isArray(value)){
               value.forEach(v => {
                   sendAnalyticsErrorFromFieldValue(baseMsg, field, v);
               })
           }else{
               sendAnalyticsErrorFromFieldValue(baseMsg, field, value);
           }

       })
}

export const sendAnalyticsException = (error) => {
    if (analyticsEnabled) sendAnalyticsError(error.message);
}

export const sendAnalyticsModalView = (name) => {
    if (analyticsEnabled) ReactGA.modalview(name);
}

export const sendAnalyticsOutboundLink = (label) => {
    if (analyticsEnabled) ReactGA.outboundLink({label: label});
}

export const sendAnalyticsEvent = (EventArgs) => {
    if (analyticsEnabled) ReactGA.event(EventArgs);
}

export const sendAnalyticsEventForAjaxRequest = (url, method, nonInteraction, EventArgs) =>{
    EventArgs = EventArgs || {};
    const eventObj = {
        category: url,
        action: method,
        nonInteraction: nonInteraction,
        ...EventArgs,
    }
    if (! eventObj.nonInteraction) delete eventObj.nonInteraction;
    sendAnalyticsEvent(eventObj);
}

initializeAnalyticsTracker();


const botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
const re = new RegExp(botPattern, 'i');

const isBot = () => {
    const userAgent = navigator.userAgent;
    return re.test(userAgent);
}


class _Analytics extends React.Component {
    state = {
        visitData: null,
    }

    getInitialVisitData = () => {
        return {
            url: window.location.origin + window.location.pathname,
            referrer: document.referrer,
        }
    }

    onConsent = (cookies_accepted=true) => {
        initializeAnalyticsTracker(true);
        const visitData = this.getInitialVisitData(true);
        visitData.cookies_accepted = cookies_accepted;
        visitData.analytics_enabled = analyticsEnabled;
        this.setState({visitData: visitData});
    }

    onNoConsent = (cookies_accepted=false) => {
        const visitData = this.getInitialVisitData();
        visitData.cookies_accepted = cookies_accepted;
        visitData.analytics_enabled = false;
        this.setState({visitData: visitData});
    }

    onAccept = (key) =>{
        this.props.closeSnackbar(key);
        localStorage.setItem(consentKey, JSON.stringify(true));
        this.onConsent(true);
    }

    onReject = (key) =>{
        this.props.closeSnackbar(key);
        localStorage.setItem(consentKey, JSON.stringify(false))
        this.onNoConsent(false);
    }

    componentDidMount() {
        const consent = JSON.parse(localStorage.getItem(consentKey));
        if (showCookieWarning && consent === null) {
            const action = key => (
                <React.Fragment>
                    <Button onClick={() => this.onAccept(key)}>
                        Accept
                    </Button>
                    <Button onClick={() => this.onReject(key)}>
                        Reject
                    </Button>
                </React.Fragment>
            );
            this.props.enqueueSnackbar(cookieWarningText, {
                variant: 'warning',
                persist: true,
                transitionDuration: 1000,
                anchorOrigin: {
                  horizontal: "left",
                  vertical: "bottom"
                },
                action
            })
            if (isBot()){
                this.onNoConsent(null);
            }
        }else if (!showCookieWarning) this.onConsent(null);
        else if (consent) this.onConsent(null);
        else if (!consent) this.onNoConsent(null);
    }

    render = () => {
        return <React.Fragment>
            <UserContext.Consumer>
                {({user}) => {
                    let ajaxKey;
                    if (user){
                        ajaxKey = user.user_id
                    }else {
                        ajaxKey = 0
                    }
                    return (
                        <React.Fragment>
                        {
                            this.state.visitData && visitUrl &&
                                <AjaxRequest key={ajaxKey} url={visitUrl} method="POST" values={this.state.visitData} passive/>
                        }
                        </React.Fragment>
                    )
                }}
            </UserContext.Consumer>
        </React.Fragment>
    }
}


const WithSnackbarAnalytics = withSnackbar(_Analytics)


export default function Analytics (props){
    return (
        <NoSsr>
            <WithSnackbarAnalytics {...props}/>
        </NoSsr>
    )
}
