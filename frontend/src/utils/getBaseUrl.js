/**
 * getBaseUrl.js
 *
 * Determines the appropriate backend API base URL
 * depending on the environment and hostname.
 *
 * Used across the application for Axios or any API calls.
 */

export const getBaseUrl = () => {
    const hostname = window.location.hostname;

    let BASE_URL = process.env.REACT_APP_BACKEND_API_URL_PROD; // default
    let DOMAIN = process.env.REACT_APP_DOMAIN_PROD; // default

    if (hostname === "localhost") {
        BASE_URL = process.env.REACT_APP_BACKEND_API_URL_DEV;
    } else if (hostname === DOMAIN) {
        BASE_URL = process.env.REACT_APP_BACKEND_API_URL_PROD;
    } else {
        BASE_URL = process.env.REACT_APP_BACKEND_API_URL_LOCAL;
    }
    return BASE_URL;
};