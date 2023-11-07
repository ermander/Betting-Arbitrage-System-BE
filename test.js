const axios = require('axios');
const fs = require('fs');

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

// async function fetchEPlayOdds() {
//     try {
//         const { data: response } = await axios.get(
//             'https://api2.cplay.it/api/Palinsesto/GetAllEventsPrematch',
//         );

//         const palinsesto = new Map();

//         response
//             .filter((e) => e.Sport_Desc === 'Calcio')
//             .forEach((match) => {
//                 const { Category_Desc, Group_Name, Group_id } = match;

//                 if (!palinsesto.has(Category_Desc)) {
//                     palinsesto.set(Category_Desc, []);
//                 }

//                 const categoryMap = palinsesto.get(Category_Desc);

//                 const existingGroup = categoryMap.find(
//                     (group) => group.Group_id === Group_id,
//                 );

//                 if (existingGroup) {
//                     existingGroup.matches.push(match);
//                 } else {
//                     categoryMap.push({
//                         Group_id,
//                         Group_Name,
//                         matches: [match],
//                     });
//                 }
//             });
//         console.log(palinsesto);
//     } catch (error) {
//         console.log(error);
//     }
// }

// fetchEPlayOdds();
