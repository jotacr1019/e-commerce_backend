import { productsIndex } from "lib/algolia";

export async function getProductById(productId) {
    const indexResponse = await productsIndex.findObject(
        (hit) => hit.objectID === productId
    );
    return indexResponse;
}
