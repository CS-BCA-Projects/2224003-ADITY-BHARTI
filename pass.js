import bcrypt from "bcrypt"

const password = "12345"; // Replace with your actual password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("🔒 Hashed password:", hash);
});