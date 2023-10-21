import algoliasearch from "algoliasearch";

const client = algoliasearch("0MHB74PS9T", "89d7a2c89f4fc77adc8a5a792d5f012b");
export const productsIndex = client.initIndex("products");
