import algoliasearch from "algoliasearch";

const algoliaAppId = process.env.algolia_APP_ID;
const algoliaAdminApiKey = process.env.algolia_admin_API_KEY;

const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
export const productsIndex = client.initIndex("products");
