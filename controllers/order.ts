import { Order } from "models/order";

type TokenData = {
    userId: string;
};
type ProductInfo = {};

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
