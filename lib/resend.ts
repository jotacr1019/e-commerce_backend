import { Resend } from "resend";

const resend_api_key = process.env.RESEND_API_KEY;
const resend = new Resend(resend_api_key);

type Data = {};

export async function sendSuccessfulMessageToBuyer(data, buyer_email: string) {
    try {
        await resend.emails.send({
            from: "E-commerce <onboarding@resend.dev>",
            to: [buyer_email],
            subject: `Reporte de compra en E-commerce`,
            html:
                `Estamos muy agradecidos por tu compra y esperamos tenerte de vuelta en nuetra plataforma pronto ${data.user_name}!` +
                "<br>" +
                "<br>" +
                "<br>" +
                "Detalles de tu compra:" +
                "<br>" +
                data.purchases.map((item) => {
                    "- Nombre del producto: " +
                        "<strong>" +
                        item.title +
                        "</strong>" +
                        "<br>" +
                        `- Precio: ${item.currency}` +
                        "<strong>" +
                        item.price +
                        "</strong>" +
                        "<br>" +
                        "- Unidades compradas: " +
                        "<strong>" +
                        item.quantity +
                        "</strong>" +
                        "<br>" +
                        "- Id del producto: " +
                        "<strong>" +
                        item.productId +
                        "</strong>" +
                        "<br>";
                }) +
                // "- Nombre del producto: " +
                // "<strong>" +
                // data.title +
                // "</strong>" +
                // "<br>" +
                // `- Precio: ${data.currency}` +
                // "<strong>" +
                // data.price +
                // "</strong>" +
                // "<br>" +
                // "- Unidades compradas: " +
                // "<strong>" +
                // data.quantity +
                // "</strong>" +
                // "<br>" +
                // "- Id del producto: " +
                // "<strong>" +
                // data.productId +
                // "</strong>" +
                // "<br>" +
                "<br>" +
                "<br>" +
                "Orden de compra número: " +
                "<strong>" +
                data.orderId +
                "</strong>",
        });
    } catch (error) {
        console.error(error);
    }
}

export async function sendFailedMessageToBuyer(data, buyer_email) {
    try {
        await resend.emails.send({
            from: "E-commerce <onboarding@resend.dev>",
            to: [buyer_email],
            subject: `Reporte de compra en E-commerce`,
            html:
                `Lamentamos informarte que tu compra no pudo ser procesada, esperamos tenerte de vuelta en nuetra plataforma pronto ${data.user_Name}!` +
                "<br>" +
                "<br>" +
                "<br>" +
                "Orden de compra número: " +
                "<strong>" +
                data.orderId +
                "</strong>",
        });
    } catch (error) {
        console.error(error);
    }
}

export async function sendMessageToSeller(data, seller_email) {
    try {
        await resend.emails.send({
            from: "E-commerce <onboarding@resend.dev>",
            to: [seller_email],
            subject: `Reporte de venta en E-commerce`,
            html:
                `El usuario ${data.user_Name} ha realizado una compra en nuestra plataforma!` +
                "<br>" +
                "<br>" +
                "<br>" +
                "Detalles del comprador: " +
                "<br>" +
                "- Nombre: " +
                "<strong>" +
                data.user_Name +
                "</strong>" +
                "<br>" +
                "- Email: " +
                "<strong>" +
                data.userEmail +
                "</strong>" +
                "<br>" +
                "<br>" +
                "Detalles de la venta:" +
                "<br>" +
                data.purchases.map((item) => {
                    "- Nombre del producto: " +
                        "<strong>" +
                        item.title +
                        "</strong>" +
                        "<br>" +
                        `- Precio: ${item.currency}` +
                        "<strong>" +
                        item.price +
                        "</strong>" +
                        "<br>" +
                        "- Unidades vendidas: " +
                        "<strong>" +
                        item.quantity +
                        "</strong>" +
                        "<br>" +
                        "- Id del producto: " +
                        "<strong>" +
                        item.productId +
                        "</strong>" +
                        "<br>" +
                        "- Unidades restantes en stock: " +
                        "<strong>" +
                        item.stock +
                        "</strong>" +
                        "<br>";
                }) +
                "<br>" +
                "<br>" +
                "Orden de compra número: " +
                "<strong>" +
                data.orderId +
                "</strong>",
        });
    } catch (error) {
        console.error(error);
    }
}

export async function sendCodeToEmail(user_email, code) {
    try {
        await resend.emails.send({
            from: "E-commerce <onboarding@resend.dev>",
            to: [user_email],
            subject: "Código de verificación",
            html:
                `Este es tu código de verificación para ingresar a tu cuenta en E-commerce:` +
                "<br>" +
                "<br>" +
                "Código: " +
                "<strong>" +
                code +
                "</strong>",
        });
    } catch (error) {
        console.error(error);
    }
}
