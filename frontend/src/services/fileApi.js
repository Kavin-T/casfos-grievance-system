const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const handleMediaOpen = (mediaPath) => {
    if (mediaPath) {
        window.open(
        `${BASE_URL}/${mediaPath}`,
        "_blank",
        "noopener noreferrer"
        );
    }
};