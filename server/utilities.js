//Universal API JSON fetcher
async function getJSON(url, apiAction, queryParameters, protocolOptions) {
    const parameters = queryParameters ? `?${querystring.stringify(queryParameters)}` : '';
    const urlWithParameters = `${url}${apiAction}${parameters}`;
    console.log("API Called with URL: " + urlWithParameters);
    const response = await fetch(urlWithParameters, protocolOptions);
    console.log("Returned from API: " + stringify(response));
    return response.json();
}

exports.getJSON = getJSON;