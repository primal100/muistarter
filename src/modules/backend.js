import fetchMock from 'fetch-mock';
 fetchMock.config.overwriteRoutes = false;

// const email = 'testuser@example.com'
// const password =  'testpassword1'
const email = 'a@a.com'
const password =  'a'
const response_key = process.env.REACT_APP_GENERAL_KEY_ERRORS

export default function mockBackend() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
        console.log(`Running in ${process.env.NODE_ENV} mode`)
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_IN_URL,
            body: {email: email, password: password}
        }, {status: 200, body: {[response_key]: 'Login successful'}});
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_IN_URL,
        }, {status: 400, body: {[response_key]: 'Login or password invalid.'}});
    } else {
        // production code
    }
}