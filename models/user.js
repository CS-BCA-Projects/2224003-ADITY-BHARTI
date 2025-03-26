const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Profession : {
        type : String,
        required : true,
        enum : ["Student","Teacher","Researcher","Writer","Librarian","Other"]
    },
    Study:{
        type:String,
        enum:["arts", "science", "social", "business", "education", "medicine", "engineering", "other"]
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
