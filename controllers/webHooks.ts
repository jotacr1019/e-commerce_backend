import { Order } from "models/order";
import { getDetailsOfPaymentLink, getTokenFromTiloPay } from "lib/apiTiloPay";
import {
    sendSuccessfulMessageToBuyer,
    sendFailedMessageToBuyer,
    sendMessageToSeller,
} from "lib/resend";

export async function verifyTransactionAndUpdateOrder(tilopayData) {
    try {
        const code = tilopayData.code;
        const tilopayToken = await getTokenFromTiloPay();

        if (code === "1") {
            const detailsOfPayment = await getDetailsOfPaymentLink(
                tilopayToken.access_token,
                tilopayData.tilopayLinkId
            );
            const order = await updateAndReturnOrder(detailsOfPayment);

            await sendMessageToSeller(
                {
                    user_name: detailsOfPayment.detail.client,
                    title: "soft bed",
                    currency: detailsOfPayment.detail.currency,
                    price: detailsOfPayment.detail.amount,
                    quantity: "1",
                    product_id: order.data.productId,
                    stock: "2",
                    order_id: detailsOfPayment.detail.reference,
                },
                order.data.aditionalInfo.sellerInfo.email
            );

            await sendSuccessfulMessageToBuyer(
                {
                    user_name: detailsOfPayment.detail.client,
                    title: "soft bed",
                    currency: detailsOfPayment.detail.currency,
                    price: detailsOfPayment.detail.amount,
                    quantity: "1",
                    product_id: order.data.productId,
                    order_id: detailsOfPayment.detail.reference,
                },
                detailsOfPayment.payments[0].email
            );
            return true;
        } else {
            const detailsOfPayment = await getDetailsOfPaymentLink(
                tilopayToken,
                tilopayData.tilopayLinkId
            );
            const order = await updateAndReturnOrder(detailsOfPayment);
            await sendFailedMessageToBuyer(detailsOfPayment.payments[0].email);
            return false;
        }
    } catch (e) {
        console.log(e);
    }
}

async function updateAndReturnOrder(datailsOfPayment) {
    const orderId = datailsOfPayment.detail.reference;
    const order = new Order(orderId);
    await order.pullOrderData();
    order.data.status =
        datailsOfPayment.payments[0].code === "1" ? "approved" : "rejected";
    order.data.updatedAt = new Date();
    order.data.backupDataFromTilopay = datailsOfPayment.payments[0];
    await order.updateOrderData();
    return order;
}
