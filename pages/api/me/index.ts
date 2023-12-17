import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
import { Auth } from "models/auth";
import {
    authMiddleware,
    schemaMiddleware,
    corsMiddleware,
} from "lib/middlewares";
import { array, object, string } from "yup";

let bodySchema = object({
    email: string(),
    personalInformation: object({
        fullName: string(),
        address: string(),
        phone: string(),
    }),
    likedItems: array(object({})),
});

async function getInfoOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const user = new User(userId);
    await user.pullUserData();
    res.status(200).send(user.data);
}

async function updateDataOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const user = new User(userId);
    user.data = req.body;
    await user.pushUserData();

    res.status(200).send(user.data);
}

async function removeLikedItemOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const user = new User(userId);
    await user.pullUserData();
    user.data.likedItems = user.data.likedItems.filter(
        (item) => item.itemId !== req.body.itemId
    );
    await user.pushUserData();
    res.status(200).send(user.data);
}

// Validate the token and execute the updateDataOfUser, getInfoOfUser and removeLikedItemOfUser
const patchHandlerAfterValidations = authMiddleware(updateDataOfUser);
const getHandlerAfterValidations = authMiddleware(getInfoOfUser);
const removeLikedItemHandler = authMiddleware(removeLikedItemOfUser);

// Call the patchHandlerAfterValidations and getHandlerAfterValidations
const methodHandler = methods({
    get: getHandlerAfterValidations,
    patch: patchHandlerAfterValidations,
    delete: removeLikedItemHandler,
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
