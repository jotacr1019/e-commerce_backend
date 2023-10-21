const apiKey = process.env.tilopay_API_KEY;
const apiUser = process.env.tilopay_API_USER;
const apiPassword = process.env.tilopay_API_PASSWORD;

type ProductData = {
    amount: string; // number???
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
    productData: ProductData,
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
                    amount: productData.amount,
                    currency: productData.currency,
                    reference: orderId,
                    type: productData.type,
                    description: productData.description,
                    client: productData.client,
                    callback_url: productData.callback_url,
                }),
            }
        );
        return await resp.json();
    } catch (e) {
        console.log(e);
    }
}
