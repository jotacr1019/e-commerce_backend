import { Resend } from "resend";

const resend_api_key = process.env.RESEND_API_KEY;
const resend = new Resend(resend_api_key);

type BuyerData = {
    user_name: string;
    title: string;
    currency: string;
    price: string;
    quantity: string;
    product_id: string;
    order_id: string;
};

type SellerData = {
    user_name: string;
    title: string;
    currency: string;
    price: string;
    quantity: string;
    product_id: string;
    stock: string;
    order_id: string;
};

export async function sendSuccessfulMessageToBuyer(
    data: BuyerData,
    buyer_email: string
) {
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
                "- Nombre del producto: " +
                "<strong>" +
                data.title +
                "</strong>" +
                "<br>" +
                `- Precio: ${data.currency} ` +
                "<strong>" +
                data.price +
                "</strong>" +
                "<br>" +
                "- Unidades compradas: " +
                "<strong>" +
                data.quantity +
                "</strong>" +
                "<br>" +
                "- Id del producto: " +
                "<strong>" +
                data.product_id +
                "</strong>" +
                "<br>" +
                "<br>" +
                "Orden de compra número: " +
                "<strong>" +
                data.order_id +
                "</strong>",
        });
    } catch (error) {
        console.error(error);
    }
}

export async function sendFailedMessageToBuyer(buyer_email: string) {
    try {
        await resend.emails.send({
            from: "E-commerce <onboarding@resend.dev>",
            to: [buyer_email],
            subject: `Reporte de compra en E-commerce`,
            html: `Lamentamos informarte que tu compra no pudo ser procesada, esperamos tenerte de vuelta en nuetra plataforma pronto!`,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function sendMessageToSeller(
    data: SellerData,
    seller_email: string
) {
    try {
        await resend.emails.send({
            from: "E-commerce <onboarding@resend.dev>",
            to: [seller_email],
            subject: `Reporte de venta en E-commerce`,
            html:
                `El usuario ${data.user_name} ha realizado una compra en nuestra plataforma!` +
                "<br>" +
                "<br>" +
                "<br>" +
                "Detalles del comprador: " +
                "<br>" +
                "- Nombre: " +
                "<strong>" +
                data.user_name +
                "</strong>" +
                "<br>" +
                "<br>" +
                "Detalles de la venta:" +
                "<br>" +
                "- Nombre del producto: " +
                "<strong>" +
                data.title +
                "</strong>" +
                "<br>" +
                `- Precio: ${data.currency} ` +
                "<strong>" +
                data.price +
                "</strong>" +
                "<br>" +
                "- Unidades vendidas: " +
                "<strong>" +
                data.quantity +
                "</strong>" +
                "<br>" +
                "- Id del producto: " +
                "<strong>" +
                data.product_id +
                "</strong>" +
                "<br>" +
                "- Unidades restantes en stock: " +
                "<strong>" +
                data.stock +
                "</strong>" +
                "<br>" +
                "<br>" +
                "Orden de compra número: " +
                "<strong>" +
                data.order_id +
                "</strong>",
        });
    } catch (error) {
        console.error(error);
    }
}

export async function sendCodeToEmail(user_email: string, code: number) {
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
