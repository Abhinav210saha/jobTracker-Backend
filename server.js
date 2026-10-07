import express from "express";
import users from "./data/data.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import User from "./model/userModel.js";
import { publicDecrypt } from "crypto";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  }),
);
app.use(express.json());

const MongoURL =
  "mongodb+srv://abhinavsaha210:abhinav123@cluster0.x4vs3kw.mongodb.net/jobTracker";

async function connectDB(params) {
  try {
    await mongoose.connect(MongoURL);
    console.log("Db is connected");
  } catch (error) {
    console.log(error);
  }
}

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "All Users", users: users });
  } catch (error) {
    return res.status(501).json("error while fetching users");
  }
});

app.post("/user", async (req, res) => {
  const { companyName, jobRole, jobType, jobStatus, salary } = req.body;
  console.log(companyName, jobRole, jobType, jobStatus, salary);

  try {
    const user = await User.create({
      companyName,
      jobRole,
      jobType,
      jobStatus,
      salary,
    });
    return res.status(201).json({ message: "User created", user: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error while creating user", error: error });
  }
});

app.put("/user/update/:id", async (req, res) => {
  try {
    const { companyName, jobRole, jobType, jobStatus, salary } = req.body;
    // console.log(companyName, jobRole, jobType, jobStatus, salary )
    let id = req.params.id;
    // console.log(id)
    let user = await User.findByIdAndUpdate(id, {
      companyName,
      jobRole,
      jobType,
      jobStatus,
      salary,
    },{returnDocument: 'after'}); //  returnDocument:'after' use beacuse we want instant update and send updated data to client

    return res.status(200).json({ mesage: "Update Successfully", user: user  });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.listen(3000, () => {
  connectDB();

  console.log("server is running on 3000");
});
