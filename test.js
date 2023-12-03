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

// testProxy();

async function fetchEPlayOdds() {
    try {
        const data = {
            auto_update: true,
            notification_sound: false,
            notification_popup: false,
            show_event_arbs: true,
            grouped: true,
            per_page: 20,
            sort_by: 'percent',
            koef_format: 'decimal',
            mode: '',
            event_id: '',
            q: '',
            event_arb_types: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            search_filter: [724958],
            is_live: false,
            bk_ids: [
                1, 3, 4, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 35, 40, 42, 43,
                44, 47, 48, 49, 54, 55, 59, 62, 63, 66, 67, 69, 72, 75, 77, 78,
                79, 81, 82, 83, 84, 86, 88, 89, 90, 91, 93, 95, 96, 98, 99, 100,
                101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114,
                115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 127, 128,
                129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
                142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154,
                155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167,
                168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
                181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
                194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 210,
                211, 212, 213, 220, 221, 222, 223, 224, 245, 246, 247, 248, 249,
                250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262,
                263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275,
                276, 277, 278, 279, 281, 282, 283, 284, 285, 286, 287, 288, 289,
                290, 291, 292, 293, 294, 295, 296, 297, 298,
            ],
        };

        // Serializza l'oggetto data in una stringa URL-encoded
        const formData = new URLSearchParams(data).toString();

        const { data: response } = await axios.get(
            'https://api2.cplay.it/api/Palinsesto/GetAllEventsPrematch',
        );

        const palinsesto = new Map();

        response
            .filter((e) => e.Sport_Desc === 'Calcio')
            .forEach((match) => {
                const { Category_Desc, Group_Name, Group_id } = match;

                if (!palinsesto.has(Category_Desc)) {
                    palinsesto.set(Category_Desc, []);
                }

                const categoryMap = palinsesto.get(Category_Desc);

                const existingGroup = categoryMap.find(
                    (group) => group.Group_id === Group_id,
                );

                if (existingGroup) {
                    existingGroup.matches.push(match);
                } else {
                    categoryMap.push({
                        Group_id,
                        Group_Name,
                        matches: [match],
                    });
                }
            });
        console.log(palinsesto);
    } catch (error) {
        console.log(error);
    }
}

const cookie = `cookieconsent_status=dismiss; wordpress_test_cookie=WP%20Cookie%20check; flarum_remember=MEGlSoj3QvKhdCS27xAbIlWNPaMKWjxmUNzbeBvn; _lscache_vary=a2564fcd5bc784b7ce399f6ea4cc0fda; wordpress_logged_in_fa686efef513bdb6e3e44099da671de0=ermander%7C1701778536%7CjQ0ZGhqD9iQHsO58BTrPMMu91IPFva4Rh7qCFvcffpq%7C0cb9a71a353437e199ff362f3c7227fa37f274e75d9667d425c08489869ccdac`;

async function fetchRobinsOddsOddsmatcher() {
    const { data: response } = await axios.get(
        'https://robinodds.it/api/odds/v2/index.php?id_book=',
        {
            headers: {
                cookie,
            },
        },
    );

    const odds = response.filter((odd, i) => {
        const { back_odd, lay_odd } = odd;
        const lay_stake = (back_odd * 1000) / (lay_odd - 0.045);
        const profit = lay_stake * (1 - 0.045) - 1000;

        const roi = (profit - 1000) / 1000;
        const percent = roi * 100;
        console.log(percent);
        // console.log(profit);
        // if (profit > 0) {
        //     console.log(odd);
        // }
    });

    //console.log('response', response);
}

fetchRobinsOddsOddsmatcher();
