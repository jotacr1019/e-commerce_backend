import { stablishLimitAndOffset } from "./requests";

test("test stablishLimitAndOffset", () => {
    const req = { query: { limit: "5", offset: "10" } } as any;
    const limit = stablishLimitAndOffset(req);
    expect(limit.limit).toBe(5);
    expect(limit.offset).toBe(10);

    const secondReq = { query: { limit: "0", offset: "10" } } as any;
    const secondLimit = stablishLimitAndOffset(secondReq);
    expect(secondLimit.limit).toBe(1);
    expect(secondLimit.offset).toBe(10);

    const thirdReq = { query: {} } as any;
    const thirdLimit = stablishLimitAndOffset(thirdReq);
    expect(thirdLimit.limit).toBe(50);
    expect(thirdLimit.offset).toBe(0);
});
