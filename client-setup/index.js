import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});

console.log("Connected to Typesense");

async function createCollection() {
  const schema = {
    name: "products",
    fields: [
      { name: "id", type: "string" },
      { name: "name", type: "string" },
      { name: "category", type: "string", facet: true },
      { name: "brand", type: "string", facet: true },
      { name: "price", type: "int32" },
      { name: "rating", type: "float" },
    ],
    default_sorting_field: "rating",
  };

  try {
    const res = await client.collections().create(schema);
    console.log(res);
  } catch (err) {
    console.log("Already exists or error:", err.message);
  }
}

createCollection();
