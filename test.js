const axios = require('axios');
const settings = require('./settings');
const headers = require('./headers');

const rateLimit = require('axios-rate-limit');

const http = rateLimit(axios.create(), {
    maxRequests: settings.RequestsRate,
    perMilliseconds: 1000,
});

const apiUrl = `https://${settings.Username}:${settings.Password}@proxy.oxylabs.io/all`;

const inSeconds = (ms) => ms * 1000;

const fetchPage = async (proxy, url) => {
    parsedProxy = new URL(proxy);

    const proxyPort = parsedProxy.port;
    parsedProxy.port = '';

    let response = null;
    try {
        response = await http.get(url, {
            headers: headers.getRandomBrowserHeaders(),
            timeout: inSeconds(settings.Timeout),
            proxy: {
                host: parsedProxy.host,
                port: proxyPort,
                auth: {
                    username: parsedProxy.username,
                    password: parsedProxy.password,
                },
            },
        });
    } catch (e) {
        return [null, e];
    }

    return [response, null];
};
/**
 * Chiamata per richiedere tutti gli eventi prematch
 * GET - https://api2.cplay.it/api/Palinsesto/GetAllEventsPrematch
 */

/**  Chiamata per richiedere le quote principali
"https://api2.cplay.it/api/Palinsesto_V3/GetManifestazioneCore?v=5f1bc66dee3b67a1952288191226f9a45f1a32c9c8ee3cbc55c7517b8757882b"
 Request body:
    {
        "BetTypeIdString": null,
        "DateFrom": null,
        "DateTo": null,
        "GroupId": 33,
        "IndexDateTo": null,
        "TypeOnly": false,
        "isQuery": false
    }
*/

async function testProxy() {
    try {
        const response = await fetchPage(
            apiUrl,
            'https://dogdummyapi.p.rapidapi.com/dogs/filter',
        );
        console.log(response);
    } catch (error) {
        console.log(error);
        console.log(settings);
    }
}
