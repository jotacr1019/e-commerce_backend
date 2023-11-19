import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { algoliaSearch } from "controllers/search";
import { schemaMiddleware, corsMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let querySchema = object({
    q: string().required(),
    limit: string(),
    offset: string(),
})
    .noUnknown(true)
    .strict();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = req.query.q as string;
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
}

// Execute the handler function
const methodHandler = methods({
    get: handler,
});

// Validate the body schema before calling the methodHandler
const validateSchema = schemaMiddleware(
    [
        {
            schema: querySchema,
            reqType: "query",
        },
    ],
    methodHandler
);

// Execute the corsMiddleware and calls the validateSchema
export default corsMiddleware(validateSchema);
