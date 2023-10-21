import { Order } from "models/order";

type QueryData = {};

export async function verifyTransactionAndUpdateOrder(tilopayData) {
    const code = tilopayData.code;
    if (code === "1") {
        await updateOrder(tilopayData);
        return true;
    } else {
        await updateOrder(tilopayData);
        return false;
    }
}

async function updateOrder(tilopayData) {
    const orderId = tilopayData.reference;
    const order = new Order(orderId);
    await order.pullOrderData();
    order.data.status = tilopayData.code === "1" ? "approved" : "rejected";
    order.data.updatedAt = new Date();
    order.data.backupDataFromTilopay = tilopayData;
    await order.updateOrderData();
}
