import type { NextApiRequest, NextApiResponse } from "next";

export default async function exchangeHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const indicator = 318;
    const startDate = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("-")
        .replace(/-/g, "/");
    const finalDate = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("-")
        .replace(/-/g, "/");
    const name = process.env.NAME_IN_EXCHANGE;
    const subLevels = "S";
    const email = process.env.EMAIL_IN_EXCHANGE;
    const token = process.env.TOKEN_IN_EXCHANGE;

    const response = await fetch(
        `https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=${indicator}&FechaInicio=${startDate}&FechaFinal=${finalDate}&Nombre=${name}&SubNiveles=${subLevels}&CorreoElectronico=${email}&Token=${token}`
    );

    if (response.ok) {
        const data = await response.text();
        res.status(200).send(data);
        return;
    }

    res.status(500).send({
        message: "An error occurred",
        error: response.statusText,
    });
}
