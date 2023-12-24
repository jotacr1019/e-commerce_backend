import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { Cart } from "models/cart";
import {
    authMiddleware,
    schemaMiddleware,
    corsMiddleware,
} from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    itemId: string(),
    cartId: string(),
});

async function getCartData(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const cart = await Cart.getCartOfUser(userId);
    if (!cart) {
        res.status(404).send({
            message: "Not found any cart",
        });
        return;
    }
    res.status(200).send(cart);
}

async function updateCartOfUser(req: NextApiRequest, res: NextApiResponse) {
    const cart = new Cart(req.body.cartId);
    await cart.pullCartData();
    cart.data.items.push({ itemId: req.body.itemId });
    await cart.pushCartData();

    res.status(200).send(cart);
}

async function removeItemInCartOfUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cart = new Cart(req.body.cartId);
    await cart.pullCartData();
    cart.data.items = cart.data.items.filter(
        (item) => item.itemId !== req.body.itemId
    );
    await cart.pushCartData();
    res.status(200).send(cart.data);
}

// Validate the token and execute the updateCartOfUser, getCartData and removeItemInCartOfUser
const patchHandlerAfterValidations = authMiddleware(updateCartOfUser);
const getHandlerAfterValidations = authMiddleware(getCartData);
const removeItemInCartHandler = authMiddleware(removeItemInCartOfUser);

// Call the patchHandlerAfterValidations and getHandlerAfterValidations
const methodHandler = methods({
    get: getHandlerAfterValidations,
    patch: patchHandlerAfterValidations,
    delete: removeItemInCartHandler,
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
