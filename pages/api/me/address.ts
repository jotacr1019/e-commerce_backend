import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
import {
    authMiddleware,
    schemaMiddleware,
    corsMiddleware,
} from "lib/middlewares";
import { object, string } from "yup";

// ******

// WAIT TO SEE WHY I NEED THIS ENDPOINT, AND FIXED IT IN POSTMAN
//  IN CASE OF NEED TO USE IT

// ******

let bodySchema = object({
    address: string().required(),
});

async function updateAddressOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const user = new User(userId);
    user.data.address = req.body.address;
    await user.pushUserData();
    res.status(200).send(user.data.address);
}

// Validate the token and execute the updateAddressOfUser
const patchHandlerAfterValidations = authMiddleware(updateAddressOfUser);

// Call the patchHandlerAfterValidations
const methodHandler = methods({
    patch: patchHandlerAfterValidations,
});

// Validate the body schema before calling the methodHandler
const validateSchema = schemaMiddleware(
    [
        {
            schema: bodySchema,
            reqType: "body",
        },
    ],
    methodHandler
);

// Execute the corsMiddleware and calls the validateSchema
export default corsMiddleware(validateSchema);
