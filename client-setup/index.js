import Typesense from "typesense";
import fs from "fs/promises";

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

// const datas = {
//   title: "The Hunger Games",
//   authors: ["Suzanne Collins"],
//   publication_year: 2008,
//   id: "1",
//   average_rating: 4.34,
//   image_url: "https://images.gr-assets.com/books/1447303603m/2767052.jpg",
//   ratings_count: 4780653,
// };

async function runBooksDemo() {
  // 1. Delete old books collection if exists
  try {
    await client.collections("books").delete();
    console.log("Old books collection deleted");
  } catch (err) {
    console.log("No old books collection found, creating new one...");
  }

  // 2. Create books collection
  const booksSchema = {
    name: "books",
    fields: [
      { name: "title", type: "string" },
      { name: "authors", type: "string[]", facet: true },
      { name: "publication_year", type: "int32", facet: true },
      { name: "ratings_count", type: "int32" },
      { name: "average_rating", type: "float" },
    ],
    default_sorting_field: "ratings_count",
  };

  await client.collections().create(booksSchema);
  console.log("Books collection created");

  // 3. Read and import books.jsonl
  const booksData = await fs.readFile("./tmp/books.jsonl");

  const importResult = await client
    .collections("books")
    .documents()
    .import(booksData);

  console.log("Books imported");
  console.log(importResult);

  // 4. Search with facet
  const searchResult = await client.collections("books").documents().search({
    q: "harry potter",
    query_by: "title",
    facet_by: "authors,publication_year",
    sort_by: "ratings_count:desc",
  });

  console.log("\nSearch Results:");
  searchResult.hits.forEach((hit) => {
    console.log(
      hit.document.title,
      "-",
      hit.document.authors?.join(", "),
      "-",
      hit.document.publication_year,
    );
  });

  console.log("\nFacet Counts:");
  console.log(JSON.stringify(searchResult.facet_counts, null, 2));
}

runBooksDemo().catch((err) => {
  console.error("Error:", err);
});
