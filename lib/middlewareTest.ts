import { authMiddleware, schemaMiddleware } from "./middlewares";
import { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import { generateToken } from "./jwt";

describe("test authMiddleware", () => {
    it("should call the callback if token is valid", () => {
        const payload = { userId: "224488" };
        const token = generateToken(payload);
        const callback = jest.fn();

        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as NextApiRequest;

        const res: NextApiResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        const middleware = authMiddleware(callback);
        middleware(req, res);

        expect(callback).toHaveBeenCalledWith(req, res, payload.userId);
    });

    //

    it("should return a 400 response if token is missing", () => {
        const callback = jest.fn();
        const req = {} as NextApiRequest;
        const res: NextApiResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        const middleware = authMiddleware(callback);
        middleware(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: "Token required" });
        expect(callback).not.toHaveBeenCalled();
    });

    //

    it("should return a 401 response if token is invalid", () => {
        const token = jest.fn().mockReturnValue("invalid-token");
        const callback = jest.fn();

        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as NextApiRequest;
        const res: NextApiResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        const middleware = authMiddleware(callback);
        middleware(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            message: "Not authorized, invalid token",
        });
        expect(callback).not.toHaveBeenCalled();
    });
});

describe("test schemamiddleware", () => {
    it("should call the callback when query and body are empty", async () => {
        const req = { body: null, query: {} } as NextApiRequest;
        const res = {} as NextApiResponse;
        const callback = jest.fn();

        const middleware = schemaMiddleware([], callback);
        await middleware(req, res);

        expect(callback).toHaveBeenCalledWith(req, res);
    });

    //

    it("should validate schemas and call the callback if they are valid", async () => {
        let bodySchema = object({
            email: string().required(),
            code: string().required(),
        });

        const req = {
            body: { email: "example@mail.com", code: "123" },
            query: {},
        } as NextApiRequest;
        const res = {} as NextApiResponse;
        const callback = jest.fn();

        const middleware = schemaMiddleware(
            [{ schema: bodySchema, reqType: "body" }],
            callback
        );
        await middleware(req, res);

        expect(callback).toHaveBeenCalledWith(req, res);
    });

    //

    it("should send 400 response if the validation fails", async () => {
        let bodySchema = object({
            email: string().required(),
            code: string().required(),
        });

        const req = {
            body: { email: "example@mail.com" },
            query: {},
        } as NextApiRequest;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;
        const callback = jest.fn();

        const middleware = schemaMiddleware(
            [{ schema: bodySchema, reqType: "body" }],
            callback
        );
        await middleware(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
