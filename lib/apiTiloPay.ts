const apiKey = process.env.tilopay_API_KEY;
const apiUser = process.env.tilopay_API_USER;
const apiPassword = process.env.tilopay_API_PASSWORD;

type PaymentLinkData = {
    amount: string;
    currency: string;
    type: number;
    description: string;
    client: string;
    callback_url: string;
};

export async function getTokenFromTiloPay() {
    const resp = await fetch("https://app.tilopay.com/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            apiuser: apiUser,
            password: apiPassword,
        }),
    });
    return await resp.json();
}

export async function createPaymentLink(
    token: string,
    paymentLinkData: PaymentLinkData,
    orderId: string
) {
    try {
        const resp = await fetch(
            "https://app.tilopay.com/api/v1/createLinkPayment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    key: apiKey,
                    amount: paymentLinkData.amount,
                    currency: paymentLinkData.currency,
                    reference: orderId,
                    type: paymentLinkData.type,
                    description: paymentLinkData.description,
                    client: paymentLinkData.client,
                    callback_url: paymentLinkData.callback_url,
                }),
            }
        );
        return await resp.json();
    } catch (e) {
        console.log(e);
    }
}

export async function getDetailsOfPaymentLink(
    token: string,
    tilopayLinkId: string
) {
    try {
        const resp = await fetch(
            `https://app.tilopay.com/api/v1/getDetailLinkPayment/${tilopayLinkId}/${apiKey}`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return await resp.json();
    } catch (e) {
        console.log(e);
    }
}
