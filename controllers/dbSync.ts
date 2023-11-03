import type { NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

export async function SyncDatabase(res: NextApiResponse) {
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
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Database Sync failed");
                    return;
                }
                res.status(200).send("Database Sync done");
            }
        );
}
