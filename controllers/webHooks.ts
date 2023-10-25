import { Order } from "models/order";
import { getDetailsOfPaymentLink, getTokenFromTiloPay } from "lib/apiTiloPay";
import {
    sendSuccessfulMessageToBuyer,
    sendFailedMessageToBuyer,
    sendMessageToSeller,
} from "lib/resend";

type QueryData = {};

export async function verifyTransactionAndUpdateOrder(tilopayData) {
    const code = tilopayData.code;
    const tilopayToken = await getTokenFromTiloPay();

    if (code === "1") {
        // console.log("code 1");
        const detailsOfPayment = await getDetailsOfPaymentLink(
            tilopayToken.access_token,
            tilopayData.tilopayLinkId
        );

        const order = await updateAndReturnOrder(detailsOfPayment);

        await sendSuccessfulMessageToBuyer(
            {
                user_name: detailsOfPayment.detail.client,
                title: "soft bed",
                currency: detailsOfPayment.detail.currency,
                price: detailsOfPayment.detail.amount,
                quantity: "1",
                productId: order.data.productId,
                orderId: detailsOfPayment.detail.reference,
            },
            detailsOfPayment.payments[0].email
        );
        console.log("success msj buyer: ", {
            user_name: detailsOfPayment.detail.client,
            title: "soft bed",
            currency: detailsOfPayment.detail.currency,
            price: detailsOfPayment.detail.amount,
            quantity: "1",
            productId: order.data.productId,
            orderId: detailsOfPayment.detail.reference,
            buyer_email: detailsOfPayment.payments[0].email,
        });
        await sendMessageToSeller(
            {
                user_name: detailsOfPayment.detail.client,
                title: "soft bed",
                currency: detailsOfPayment.detail.currency,
                price: detailsOfPayment.detail.amount,
                quantity: "1",
                productId: order.data.productId,
                stock: 2,
                orderId: detailsOfPayment.detail.reference,
            },
            order.data.aditionalInfo.sellerInfo.email
        );
        console.log("success msj seller: ", {
            user_name: detailsOfPayment.detail.client,
            title: "soft bed",
            currency: detailsOfPayment.detail.currency,
            price: detailsOfPayment.detail.amount,
            quantity: "1",
            productId: order.data.productId,
            stock: 2,
            orderId: detailsOfPayment.detail.reference,
            seller_email: order.data.aditionalInfo.sellerInfo.email,
        });
        return true;
    } else {
        console.log("code NOT 1");
        const detailsOfPayment = await getDetailsOfPaymentLink(
            tilopayToken,
            tilopayData.tilopayLinkId
        );
        const order = await updateAndReturnOrder(detailsOfPayment);
        await sendFailedMessageToBuyer(
            detailsOfPayment.detail.reference,
            detailsOfPayment.payments[0].email
        );
        return false;
    }
}

async function updateAndReturnOrder(tilopayData) {
    const orderId = tilopayData.detail.reference;
    const order = new Order(orderId);
    await order.pullOrderData();
    order.data.status =
        tilopayData.payments[0].code === "1" ? "approved" : "rejected";
    order.data.updatedAt = new Date();
    order.data.backupDataFromTilopay = tilopayData.payments[0];
    await order.updateOrderData();
    return order;
}
