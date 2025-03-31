const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('./models/Book');
const Category = require('./models/Category');

const uri = "mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net/RishiVerse";

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const booksData = JSON.parse(fs.readFileSync('book.json', 'utf-8'));

const importData = async () => {
    try {
        await Book.deleteMany();
        await Category.deleteMany();

        const categoryMap = {}; // Store created categories

        for (const book of booksData) {
            if (!categoryMap[book.genre]) {
                const newCategory = await Category.create({ name: book.genre });
                categoryMap[book.genre] = newCategory._id;
            }
        }

        const booksToInsert = booksData.map(book => ({
            title: book.title,
            author: book.author,
            genre: categoryMap[book.genre], // Assign category ID
            description: book.description || "No description available.",
            contentUrl: book.contentUrl || ""
        }));

        await Book.insertMany(booksToInsert);

        console.log("✅ Data Imported Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error Importing Data:", error);
        process.exit(1);
    }
};

importData();