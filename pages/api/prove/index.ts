import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCodeToUser } from "controllers/auth";
import { schemaMiddleware, corsMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    email: string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const indicador = 317;
    const fechaInicio = "19/12/2023";
    const fechaFinal = "19/12/2023";
    const name = "José Joaquín Fernández";
    const subNiveles = "S";
    const correo = "jotaj19@hotmail.com";
    const token = "1NN2JU10ON";
    const response = await fetch(
        `https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=${indicador}&FechaInicio=${fechaInicio}&FechaFinal=${fechaFinal}&Nombre=${name}&SubNiveles=${subNiveles}&CorreoElectronico=${correo}&Token=${token}`
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
