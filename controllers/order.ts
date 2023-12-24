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

export async function createOrderforSingleProduct(
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

export async function createOrderforMultipleProducts(
    userId: string,
    productInfo
): Promise<Order> {
    const newOrder = await Order.createNewOrder({
        userId: userId,
        products: productInfo,
        aditionalInfo: {
            sellerInfo: {
                email: productInfo[0].sellerEmail,
            },
        },
        status: "pending",
    });
    return newOrder;
}

export async function getPaymentLink(
    clientName: string,
    orderId: string,
    totalAmount
): Promise<PaymentLinkResponse> {
    const tilopayResponse = await getTokenFromTiloPay();
    const tilopayToken = tilopayResponse.access_token;

    const dataForPaymentLink = {
        amount: totalAmount,
        currency: "CRC",
        type: 1,
        description: "Payment link for e-commerce",
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
