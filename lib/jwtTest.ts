import { generateToken, decodeToken } from "./jwt";

test("generate and decode token", () => {
    const payload = { userId: "224488" };

    const token = generateToken(payload);
    const decodedToken = decodeToken(token);
    delete decodedToken["iat"];

    expect(decodedToken).toEqual(payload);
});
