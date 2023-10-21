import { Order } from "models/order";

type QueryData = {};

export async function verifyTransactionAndUpdateOrder(query) {
    const code = query.code;
    if (code === "1") {
        await updateOrder(query);
        return true;
    } else {
        await updateOrder(query);
        return false;
    }
}

async function updateOrder(query) {
    const orderId = query.reference;
    const order = new Order(orderId);
    await order.pullOrderData();
    order.data.status = query.code === "1" ? "approved" : "rejected";
    order.data.updatedAt = new Date();
    order.data.backupDataFromTilopay = query;
    await order.updateOrderData();
}
