import { Order } from "models/order";
import { getTokenFromTiloPay, createPaymentLink } from "lib/apiTiloPay";

type TokenData = {
    userId: string;
};

type PaymentLinkResponse = {
    url: string;
    id: number;
};

type ProductInfo = {};

type ProductData = {};

export async function createOrder(
    token: TokenData,
    productId: string,
    productInfo,
    product
): Promise<Order> {
    const newOrder = await Order.createNewOrder({
        userId: token.userId,
        productId,
        aditionalInfo: {
            productInfo,
            sellerInfo: {
                email: product.object["Seller email"],
            },
        },
        status: "pending",
    });
    return newOrder;
}

export async function getPaymentLink(
    clientName: string,
    orderId: string,
    product
): Promise<PaymentLinkResponse> {
    const tilopayResponse = await getTokenFromTiloPay();
    const tilopayToken = tilopayResponse.access_token;

    const dataForPaymentLink = {
        amount: product.object["Unit cost"],
        currency: product.object["Currency"],
        type: 1,
        description: product.object["Description"],
        client: clientName,
        callback_url:
            "https://e-commerce-backend-rho-blush.vercel.app/api/webHooks/tilopay",
    };

    const paymentLink = await createPaymentLink(
        tilopayToken,
        dataForPaymentLink,
        orderId
    );
    return { url: paymentLink.url, id: paymentLink.id };
}
