import Typesense from "typesense";
import fs from "fs/promises";

// Connection Object Create
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
//   title: "The Princess Diaries",
//   authors: ["Meg Cabot"],
//   publication_year: 2000,
//   id: "500",
//   average_rating: 3.76,
//   image_url: "https://images.gr-assets.com/books/1355011082m/38980.jpg",
//   ratings_count: 193140,
// };

// Collection Create

const booksSchema = {
  name: "books",
  fields: [
    { name: "title", type: "string" },
    { name: "authors", type: "string[]", facet: true },
    { name: "publication_year", type: "int32", facet: true },
    { name: "average_rating", type: "float" },
    { name: "ratings_count", type: "int32" },
  ],
  default_sorting_field: "average_rating:desc",
};

async function deleteBooks() {
  try {
    const res = await client
      .collections("books")
      .delete()
      .then((deletedData) => {
        console.log("deleted data: ", deletedData);
        return {
          status: 200,
          message: "Successfully Delete Books Collection",
        };
      });
    return res;
  } catch (error) {
    return {
      status: 500,
      message: "Error While Deleting a Collection",
    };
  }
}

const deleteBooksResponse = await deleteBooks();

if (deleteBooks.status === 500) {
  console.log("hhhhhhhhhhhhhh");
  try {
    client
      .collections("books")
      .documents()
      .create(booksSchema)
      .then((data) => {
        console.log("created schema : ", data);
      });
  } catch (error) {
    console.error("Error while create a collection");
  }
}

console.log("response : ", deleteBooksResponse);
