/* format json into url parameters */
export const formatParams = params => {
    return Object.keys(params)
        .map((key) => key + "=" + encodeURIComponent(params[key]))
        .join("&");
};