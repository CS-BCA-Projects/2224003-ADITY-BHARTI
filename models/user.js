const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profession : {

        type : String,
        required : true,
        enum : ["Student","Teacher","Researcher","Writer","Librarian","Other"]
    },
    feildofworkstudy:{
        type:String,
        required:true,
        enum:["Art & Humanities","Science & Technology","Social Sciences","Business & Economics","Health & Medicine","Engineering & Technology","Other"]
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('Users', userSchema);
module.exports = User;
