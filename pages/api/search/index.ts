import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { algoliaSearch } from "controllers/search";

export default methods({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const query = req.query.search as string;
            const { indexResponse, limit, offset } = await algoliaSearch(
                req,
                query
            );

            if (!indexResponse) {
                res.status(404).send("Search not found");
                return;
            }

            res.status(200).json({
                results: indexResponse.hits,
                pagination: {
                    limit,
                    offset,
                    total: indexResponse.nbHits,
                },
            });
        } catch (e) {
            res.status(500).send({
                message: "An error occurred",
                error: e,
            });
        }
    },
});
