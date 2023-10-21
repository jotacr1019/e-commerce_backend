import type { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    airtableBase("tbl5llKcrP2mcRamZ")
        .select({
            pageSize: 10,
        })
        .eachPage(
            async function (records, fetchNextPage) {
                const objects = records.map((r) => {
                    return {
                        objectID: r.id,
                        ...r.fields,
                    };
                });
                await productsIndex.saveObjects(objects);

                // console.log("Next page!!");
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Database Sync failed");
                    return;
                }
                // console.log("DONE");
                res.status(200).send("Database Sync done");
            }
        );
}
