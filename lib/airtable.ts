import Airtable from "airtable";

export var airtableBase = new Airtable({
    apiKey: process.env.airtable_API_KEY,
}).base(process.env.airtable_BASE_ID);
