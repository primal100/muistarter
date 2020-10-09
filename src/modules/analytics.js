import React from 'react';
import ReactGA from 'react-ga';
import { Button} from "@material-ui/core";
import { withSnackbar} from "notistack";
import { parseBool } from "./utils"
import AjaxRequest from "./components/AjaxRequest";
import { UserContext } from "./contexts"


const visitUrl = process.env.REACT_APP_VISIT_URL;
const trackingID = process.env.REACT_APP_ANALYTICS_TRACKING_ID
const trackingDebugMode = parseBool(process.env.REACT_APP_ANALYTICS_DEBUG_MODE);
const trackingTestMode = parseBool(process.env.REACT_APP_ANALYTICS_TEST_MODE);
const encryptionKey = process.env.REACT_APP_ANALYTICS_ENCRYPTION_KEY;
const showCookieWarning = parseBool(process.env.REACT_APP_SHOW_COOKIE_WARNING);
const cookieWarningText = process.env.REACT_APP_COOKIE_WARNING_TEXT ||
    "This site uses cookies in order to provide and secure our website";


const consentKey = "CookieConsent";

let gaEnabled = false;


export const initializeGATracker = (hasConsent) => {
    hasConsent = hasConsent || JSON.parse(localStorage.getItem(consentKey));
    console.log(!gaEnabled, trackingID, hasConsent)
    if (!gaEnabled && trackingID && hasConsent) {
        ReactGA.initialize(trackingID, {
            debug: trackingDebugMode,
            testMode: trackingTestMode
        });
        console.log('Initialized Google Analytics with trackingID', trackingID);
        gaEnabled = true;
        pageViewGA();
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
        path = path || window.location.pathname;
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

initializeGATracker();


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
        console.log('Consent exists')
        initializeGATracker(true);
        const visitData = this.getInitialVisitData(true);
        visitData.cookies_accepted = cookies_accepted;
        visitData.analytics_enabled = gaEnabled;
        this.setState({visitData: visitData});
    }

    onNoConsent = (cookies_accepted=false) => {
        console.log('Consent does not exist')
        const visitData = this.getInitialVisitData();
        visitData.cookies_accepted = cookies_accepted;
        visitData.analytics_enabled = false;
        this.setState({visitData: visitData});
    }

    onAccept = (key) =>{
        console.log('Consent hsa been accepted')
        this.props.closeSnackbar(key);
        localStorage.setItem(consentKey, JSON.stringify(true));
        this.onConsent(true);
    }

    onReject = (key) =>{
         console.log('Consent has been rejected')
        this.props.closeSnackbar(key);
        localStorage.setItem(consentKey, JSON.stringify(false))
        this.onNoConsent(false);
    }

    componentDidMount() {
        const consent = JSON.parse(localStorage.getItem(consentKey));
        console.log('Mounting Analytics, consent:', consent, 'showCookieWarning:', showCookieWarning)
        if (showCookieWarning && consent === null) {
            console.log('Showing cookie warning with no consent in localStorage')
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
                    console.log('Rendering analytics with user', user)
                    if (user){
                        ajaxKey = user.user_id
                    }else {
                        ajaxKey = 0
                    }
                    console.log('Rendering analytics with ajaxKey', ajaxKey)
                    console.log('Rendering analytics with data', this.state.visitData)
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


export const Analytics = withSnackbar(_Analytics)