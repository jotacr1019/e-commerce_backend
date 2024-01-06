import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import {
    createOrderforSingleProduct,
    createOrderforMultipleProducts,
    getPaymentLink,
} from "controllers/order";
import { getProductById } from "controllers/products";
import {
    authMiddleware,
    schemaMiddleware,
    corsMiddleware,
} from "lib/middlewares";
import { getExchangeRate } from "lib/exchangeRate";
import { array, object, string, number } from "yup";

let querySchema = object({
    productId: string().required(),
});

let singlebodySchema = object({
    productInfo: object({
        name: string(),
        quantity: number(),
        color: string(),
        stock: number(),
    })
        .noUnknown(true)
        .strict(),
    clientInfo: object({
        clientName: string().required(),
    }),
})
    .noUnknown(true)
    .strict();

//

let MultiplebodySchema = object({
    products: array(
        object({
            itemId: string().required(),
            name: string(),
            quantity: number(),
            color: string(),
            stock: number(),
            sellerEmail: string(),
        })
            .noUnknown(true)
            .strict()
    ).required(),
    clientInfo: object({
        clientName: string().required(),
    }),
})
    .noUnknown(true)
    .strict();

async function handlerSingleProduct(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    try {
        const { productId } = req.query as any;
        const productInfo = req.body.productInfo;
        const clientName = req.body.clientInfo.clientName;

        const productFound: any = await getProductById(productId);
        if (!productFound) {
            res.status(404).send({
                message: "Product not found",
            });
            return;
        }

        const exchangeRate = await getExchangeRate();

        // console.log(productFound.object.Currency);
        // console.log(productFound.object["Unit cost"]);
        let priceOfProduct;
        if (productFound.object.Currency === "USD") {
            priceOfProduct = await Promise.resolve(
                productFound.object["Unit cost"] * exchangeRate
            );
        } else {
            priceOfProduct = productFound.object["Unit cost"];
        }

        const newOrder = await createOrderforSingleProduct(
            userId,
            productId,
            productInfo,
            productFound
        );

        const paymentLink = await getPaymentLink(
            clientName,
            newOrder.id,
            priceOfProduct
        );
        const { url, linkId, orderId } = paymentLink;

        res.status(200).send({ url, linkId, orderId });
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}

async function handlerMultipleProducts(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    console.log("handlerMultipleProducts");
    try {
        const detailOfProducts = req.body.products;
        const clientName = req.body.clientInfo.clientName;

        const newOrder = await createOrderforMultipleProducts(
            userId,
            detailOfProducts
        );

        const allProducts = detailOfProducts.map(async (product) => {
            return await getProductById(product.itemId);
        });
        const products = await Promise.all(allProducts);

        const prices = await Promise.all(
            products.map(async (product) => {
                const productPrice = await Promise.all(
                    detailOfProducts.map(async (item) => {
                        if (item.itemId === product.object.objectID) {
                            if (product.object.Currency === "USD") {
                                const exchangeRate = await getExchangeRate();
                                return (
                                    product.object["Unit cost"] *
                                    item.quantity *
                                    exchangeRate
                                );
                            }
                            return product.object["Unit cost"] * item.quantity;
                        }
                        return 0;
                    })
                );

                const sumOfEachProductPrice = productPrice.reduce(
                    (a, b) => a + b
                );
                return sumOfEachProductPrice;
            })
        );

        const totalAmount = prices.reduce((a, b) => a + b);

        const paymentLink = await getPaymentLink(
            clientName,
            newOrder.id,
            totalAmount
        );
        const { url, linkId, orderId } = paymentLink;

        res.status(200).send({ url, linkId, orderId });
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}

// Apply corsMiddleware and schemaMiddleware to every handler
const singleProductHandlerWithMiddleware = schemaMiddleware(
    [
        {
            schema: querySchema,
            reqType: "query",
        },
        {
            schema: singlebodySchema,
            reqType: "body",
        },
    ],
    authMiddleware(handlerSingleProduct)
);

const multipleProductHandlerWithMiddleware = schemaMiddleware(
    [
        {
            schema: MultiplebodySchema,
            reqType: "body",
        },
    ],
    authMiddleware(handlerMultipleProducts)
);

// Define the methods for each handler
const singleProductMethodHandler = methods({
    post: singleProductHandlerWithMiddleware,
});

const multipleProductsMethodHandler = methods({
    post: multipleProductHandlerWithMiddleware,
});

// Export the main function to handle the requests
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productId } = req.query;

    if (productId) {
        return singleProductMethodHandler(req, res);
    }
    console.log("if NO Multiple products");
    return multipleProductsMethodHandler(req, res);
}

export default corsMiddleware(handler);
