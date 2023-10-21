import type { NextApiRequest, NextApiResponse } from "next";

export function stablishLimitAndOffset(
    req: NextApiRequest,
    maxLimit: number = 50,
    maxOffset: number = 1000
) {
    const queryLimit = parseInt(req.query.limit as string);
    const queryOffset = parseInt(req.query.offset as string);

    const limitIsntZero = queryLimit === 0 ? 1 : queryLimit;
    const limit = limitIsntZero <= maxLimit ? limitIsntZero : maxLimit;
    const offset = queryOffset < maxOffset ? queryOffset : 0;

    return {
        limit,
        offset,
    };
}
