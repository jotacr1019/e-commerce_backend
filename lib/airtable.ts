import Airtable from "airtable";

export var airtableBase = new Airtable({
    apiKey: process.env.airtable_API_KEY,
}).base(process.env.airtable_BASE_ID);

// export const response = async () => {
//     const res = await fetch(
//         `https://api.airtable.com/v0/appkw7hNo3nFGpZsn/tbl5llKcrP2mcRamZ`,
//         {
//             headers: {
//                 Authorization: `Bearer paterBuGkEA8LO9pv.fee877a4b0d1a620524e2d45746b12541762137fb836e88e269dd0a08ebf3563`,
//             },
//         }
//     );
//     // return res;
//     return await res.json();
// };
