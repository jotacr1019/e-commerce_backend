import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCodeToUser } from "controllers/auth";
import { schemaMiddleware, corsMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    email: string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("in");
    const response = await fetch(
        "https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=316&FechaInicio=19/12/2023&FechaFinal=19/12/2023&Nombre=%22Jos%C3%A9%20Joaqu%C3%ADn%20Fern%C3%A1ndez%22&SubNiveles=%22N%22&CorreoElectronico=jotaj19@hotmail.com&Token=1NN2JU10ON"
    );
    if (response.ok) {
        const data = await response.text();
        res.status(200).send(data);
    } else {
        res.status(500).send({
            message: "An error occurred",
            error: response.statusText,
        });
    }
}

// Execute the handler function
const methodHandler = methods({
    get: handler,
});

// Validate the body schema before calling the methodHandler
const validateSchema = schemaMiddleware(
    [
        {
            schema: bodySchema,
        },
    ],
    methodHandler
);

// Execute the corsMiddleware and calls the validateSchema
export default corsMiddleware(validateSchema);
