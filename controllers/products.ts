import { productsIndex } from "lib/algolia";

export async function getProductById(productId) {
    const indexResponse = await productsIndex.findObject(
        (hit) => hit.objectID === productId
    );
    return indexResponse;
}

export async function getAllProducts() {
    const indexResponse = await productsIndex.search("");
    return indexResponse;
}
