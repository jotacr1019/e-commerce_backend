import { Order } from "models/order";

type TokenData = {
    userId: string;
};
type ProductInfo = {};

export async function createOrder(
    token: TokenData,
    productId: string,
    productInfo
): Promise<Order> {
    const newOrder = await Order.createNewOrder({
        userId: token.userId,
        productId,
        aditionalInfo: productInfo,
        status: "pending",
    });
    return newOrder;
}
