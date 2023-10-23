import { Order } from "models/order";
import { getDetailsOfPaymentLink, getTokenFromTiloPay } from "lib/apiTiloPay";

type QueryData = {};

export async function verifyTransactionAndUpdateOrder(tilopayData) {
    const code = tilopayData.code;
    const tilopayToken = await getTokenFromTiloPay();
    if (code === "1") {
        const resp = await getDetailsOfPaymentLink(
            tilopayToken,
            tilopayData.tilopayLinkId
        );
        console.log({ resp });
        await updateOrder(resp);
        return true;
    } else {
        const resp = await getDetailsOfPaymentLink(
            tilopayToken,
            tilopayData.tilopayLinkId
        );
        console.log({ resp });
        await updateOrder(resp);
        return false;
    }
}

async function updateOrder(tilopayData) {
    const orderId = tilopayData.detail.reference;
    const order = new Order(orderId);
    await order.pullOrderData();
    order.data.status =
        tilopayData.payments[0].code === "1" ? "approved" : "rejected";
    order.data.updatedAt = new Date();
    order.data.backupDataFromTilopay = tilopayData.payments;
    await order.updateOrderData();
}
