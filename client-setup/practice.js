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

// const data = {
//   title: "The Hunger Games",
//   authors: ["Suzanne Collins"],
//   publication_year: 2008,
//   id: "1",
//   average_rating: 4.34,
//   image_url: "https://images.gr-assets.com/books/1447303603m/2767052.jpg",
//   ratings_count: 4780653,
// };

let booksSchema = {
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

async function createSchema() {
  // 1. Delete old books collection if exists
  try {
    await client.collections("books").delete();
    console.log("Old books collection deleted");
  } catch (err) {
    console.log("No old books collection found, creating new one...");
  }

  try {
    const data = await client.collections().create(booksSchema);
    console.log(data);
  } catch (error) {
    console.log("Error While creating schema called books");
  }
}

await createSchema();

// import data
const booksInJsonl = await fs.readFile("./tmp/books.jsonl");
await client.collections("books").documents().import(booksInJsonl);

const searchQuery = {
  q: "The Hunger Games Box",
  query_by: "title",
  sort_by: "publication_year:asc",
};

client
  .collections("books")
  .documents()
  .search(searchQuery)
  .then((resultData) => {
    console.log("datas: ", resultData);
  });
