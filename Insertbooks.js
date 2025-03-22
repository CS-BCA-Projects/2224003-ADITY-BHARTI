const { MongoClient } = require("mongodb");

// Replace with your MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function insertBooks() {

    try {
        await client.connect();
        const database = client.db("rishiverse");
        const books = database.collection("books");

        // Example book data
        const bookData = {
            title: "Natya Shastra",
            author: "Bharata Muni",
            genre: "Dance",
            text: "The Natya Shastra is an ancient Sanskrit text on performing arts...",
            summary: "An ancient Sanskrit text on music, dance, and drama.",
            text_url: "https://archive.org/details/natyashastra",
            audio_url: "https://example.com/natya_shastra.mp3"
        };

        // Insert data
        const result = await books.insertOne(bookData);
        console.log(`Book inserted with ID: ${result.insertedId}`);
    } catch (error) {
        console.error("Error inserting book:", error);
    } finally {
        await client.close();
    }
}

Insertbooks();
