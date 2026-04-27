const express = require("express");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");
const app = express();

app.use(cors());
app.use(express.json());

// EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com", // REPLACE WITH YOUR GMAIL
        pass: "xxxx xxxx xxxx xxxx"    // REPLACE WITH YOUR 16-DIGIT APP PASSWORD
    }
});

app.post("/signup", (req, res) => {
    const { email, password } = req.body;
    let users = [];
    if (fs.existsSync("users.json")) users = JSON.parse(fs.readFileSync("users.json"));
    
    if (users.find(u => u.email === email)) return res.status(400).send({ message: "User exists!" });

    users.push({ email, password });
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    // SEND WELCOME EMAIL
    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Welcome to PCII Academy",
        text: "Thank you for signing up! You can now enroll in our music courses."
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Email error:", error);
        else console.log("Email sent: " + info.response);
    });

    res.send({ status: "Success", message: "Account created and Email sent!" });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!fs.existsSync("users.json")) return res.status(400).send({ message: "No users found" });
    const users = JSON.parse(fs.readFileSync("users.json"));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) res.send({ status: "Success", message: "Logged in!" });
    else res.status(401).send({ message: "Invalid credentials" });
});

app.listen(3000, () => console.log("Server running on 3000"));
