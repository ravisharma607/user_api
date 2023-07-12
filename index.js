import dotenv from "dotenv"
import express from "express";
import mongoose from "mongoose";
import cors from "cors"
const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

dotenv.config({path:"./config.env"})
const DB = process.env.DATABASE
// Assigning Port
const PORT = process.env.PORT;


// Connecting To The Database
mongoose.connect(DB).then(() => {
    console.log('Database Connected Successfully');
}).catch((err) => {
    console.log('Unable To Connect Due To ', err);
})
// Defining User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})
// Creating a new Collection
const User = new mongoose.model("User", userSchema)


// Creating Routes
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
    .then((user) => {
            if (user) {
                if (password === user.password) {
                    res.send({success:true, message: 'Welcome', user: user });
                }
                else {
                    res.send({success:false, message: "Invalid Password" })
                }
            } else {
                res.send({success:false, message: "Invalid User" })
            }
        })
        .catch((err) => {
            res.send(err);
        });
})
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Checking User already exist or not
    User.findOne({ username: username })
        .then((user) => {
            if (user) {
                res.send({success:false, message: "Username Already Exist" });
            } else {
                const newUser = new User({
                    username,
                    password,
                });
                newUser.save()
                    .then(() => {
                        res.send({success:true, message: 'Successfully Registered' });
                    })
                    .catch((err) => {
                        res.send(err);
                    });
            }
        })
        .catch((err) => {
            res.send(err);
        });
})

// Listening Port
app.listen(PORT, () => {
    console.log(`Server Running At ${PORT}`);
})