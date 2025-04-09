const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isAdmin = require('../middleware/isAdmin');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profession: {
        type: String,
        required: true,
        enum: ["Student", "Teacher", "Researcher", "Writer", "Librarian", "Other"]
    },
    study: {
        type: String,
        required: true,
        enum: ["arts", "science", "social", "business", "education", "medicine", "engineering", "other"]
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    password: { type: String, required: true },
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next() // if password was not modified just return it not execute the fun

    this.password = await bcrypt.hash(this.password, 10) //hashing the password
    console.log("Password hashed successfully", this.password)
    next()
});

userSchema.methods.isPasswordCorrect = async function (password) {
    console.log("Password to check: ", password);
    console.log("Hashed password: ", this.password);
    return await bcrypt.compare(password, this.password)
}

// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
