import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "xyz", // master/admin key
  connectionTimeoutSeconds: 2,
});

async function createSearchOnlyKey() {
  const searchOnlyKey = await client.keys().create({
    description: "Search-only key for frontend",
    actions: ["documents:search"],
    collections: ["books"], // products হলে "products" দাও
  });

  console.log("Search-only API Key created:");
  console.log(searchOnlyKey);
}

createSearchOnlyKey().catch((err) => {
  console.error(err);
});