const parseString = require("xml2js").parseString;

export async function getExchangeRate(): Promise<number> {
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

    const data = await response.text();

    return new Promise((resolve, reject) => {
        parseString(data, function (err, result) {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const match = result.string["_"].match(
                /<NUM_VALOR>[\d.]+<\/NUM_VALOR>/
            );
            const results = match ? match[0] : null;

            const exchangeRate = results
                .replace("<NUM_VALOR>", "")
                .replace("</NUM_VALOR>", "");

            resolve(Math.round(parseFloat(exchangeRate)));
        });
    });
}
