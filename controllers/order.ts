import { Order } from "models/order";
import { getTokenFromTiloPay, createPaymentLink } from "lib/apiTiloPay";

type PaymentLinkResponse = {
    url: string;
    linkId: number;
    orderId: string;
};

// esperar a ver como va a ser la info final de los products
type ProductInfo = {};
type ProductData = {};

export async function createOrder(
    userId: string,
    productId: string,
    productInfo,
    product
): Promise<Order> {
    const newOrder = await Order.createNewOrder({
        userId: userId,
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
    return { url: paymentLink.url, linkId: paymentLink.id, orderId };
}
