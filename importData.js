const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Book = require("./models/Book"); // Ensure model paths are correct
const Category = require("./models/Category"); // Use lowercase if file name is lowercase

// ✅ Replace with your actual MongoDB URI
const mongoURI = 'mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net/RishiVerse';

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
}

// Load JSON Data
function loadJSON(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (error) {
        console.error(`❌ Error loading ${filename}:`, error);
        return null;
    }
}

// Import Data into MongoDB
async function importData() {
    try {
        await connectDB();

        // ✅ Load books from JSON file
        const booksData = loadJSON("book.json");
        if (!booksData) {
            console.error("❌ No book data found.");
            return;
        }

        // ✅ Fix: Create Categories First
        const categoryMap = {};
        for (const book of booksData) {
            if (!categoryMap[book.genre]) {
                let category = await Category.findOne({ name: book.genre });

                // ✅ Fix: Check if category exists
                if (!category) {
                    category = new Category({ name: book.genre });

                    // ✅ Fix: Validate before saving
                    try {
                        await category.save();
                        console.log(`✅ Created Category: ${book.genre}`);
                    } catch (err) {
                        console.error(`❌ Category validation error for ${book.genre}:`, err.message);
                        continue; // Skip invalid categories
                    }
                }

                categoryMap[book.genre] = category._id;
            }
        }

        // ✅ Insert Books with Category References
        const booksToInsert = booksData.map(book => ({
            title: book.title,
            author: book.author,
            genre: categoryMap[book.genre], // Assign category ID
            description: book.description || "No description available",
            contentUrl: book.contentUrl || "#"
        }));

        await Book.insertMany(booksToInsert);
        console.log(`✅ Successfully imported ${booksToInsert.length} books.`);

        mongoose.connection.close();
        console.log("✅ MongoDB Connection Closed.");
    } catch (error) {
        console.error("❌ Error Importing Data:", error);
    }
}

importData(); // Run the import script