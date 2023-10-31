import type { NextApiRequest } from "next";
import { productsIndex } from "lib/algolia";
import { stablishLimitAndOffset } from "lib/requests";

export async function algoliaSearch(req: NextApiRequest, query: string) {
    const { limit, offset } = stablishLimitAndOffset(req);
    const indexResponse = await productsIndex.search(query, {
        hitsPerPage: limit,
        page: offset > 1 ? Math.floor(offset / limit) : 0,
    });
    return { indexResponse, limit, offset };
}
