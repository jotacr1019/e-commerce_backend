import { productsIndex } from "lib/algolia";

export async function getProductById(productId) {
    try {
        const indexResponse = await productsIndex.findObject(
            (hit) => hit.objectID === productId
        );
        return indexResponse;
    } catch (e) {
        console.log(e);
    }
}
