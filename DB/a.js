const mongoose = require("mongoose");

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("✅ Already connected to MongoDB");
        return;
    }

    try {
        await mongoose.connect("mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
