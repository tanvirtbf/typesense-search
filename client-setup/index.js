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

async function runFacetDemo() {
  // 1. Delete old collection if exists
  try {
    await client.collections("products").delete();
    console.log("Old products collection deleted");
  } catch (err) {
    console.log("No old collection found, creating new one...");
  }

  // 2. Create collection
  const schema = {
    name: "products",
    fields: [
      { name: "name", type: "string" },

      // Facet true means: ei field diye filter option + count ber kora jabe
      { name: "category", type: "string", facet: true },
      { name: "brand", type: "string", facet: true },

      { name: "price", type: "int32" },
      { name: "rating", type: "float" },
    ],
    default_sorting_field: "rating",
  };

  await client.collections().create(schema);
  console.log("Products collection created");

  // 3. Add products
  const products = [
    {
      id: "1",
      name: "Simple Face Wash",
      category: "Skincare",
      brand: "Simple",
      price: 450,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Cetaphil Face Wash",
      category: "Skincare",
      brand: "Cetaphil",
      price: 850,
      rating: 4.7,
    },
    {
      id: "3",
      name: "Garnier Face Wash",
      category: "Skincare",
      brand: "Garnier",
      price: 350,
      rating: 4.2,
    },
    {
      id: "4",
      name: "Simple Moisturizer",
      category: "Skincare",
      brand: "Simple",
      price: 600,
      rating: 4.4,
    },
    {
      id: "5",
      name: "Maybelline Foundation",
      category: "Makeup",
      brand: "Maybelline",
      price: 1200,
      rating: 4.6,
    },
    {
      id: "6",
      name: "Lakme Face Primer",
      category: "Makeup",
      brand: "Lakme",
      price: 750,
      rating: 4.1,
    },
  ];

  await client.collections("products").documents().import(products);
  console.log("Products inserted");

  // 4. Search with facet
  const searchResult = await client.collections("products").documents().search({
    q: "face",
    query_by: "name",
    facet_by: "brand,category",
    sort_by: "rating:desc",
  });

  console.log("\nSearch Results:");
  searchResult.hits.forEach((hit) => {
    console.log(hit.document.name, "-", hit.document.brand, "-", hit.document.category);
  });

  console.log("\nFacet Counts:");
  console.log(JSON.stringify(searchResult.facet_counts, null, 2));
}

runFacetDemo();