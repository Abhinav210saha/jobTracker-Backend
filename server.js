import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Job from "./model/jobModel.js";

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

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).json({ message: "All jobs", jobs: jobs });
  } catch (error) {
    return res.status(501).json("error while fetching jobs");
  }
});

app.post("/job", async (req, res) => {
  const { companyName, jobRole, jobType, jobStatus, salary } = req.body;
//   console.log(companyName, jobRole, jobType, jobStatus, salary);

  try {
    const newJob = await Job.create({
      companyName,
      jobRole,
      jobType,
      jobStatus,
      salary,
    });
    return res.status(201).json({ message: "Job created", newJob: newJob });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error while creating Job", error: error });
  }
});

app.put("/job/update/:id", async (req, res) => {
  try {
    const { companyName, jobRole, jobType, jobStatus, salary } = req.body;
    // console.log(companyName, jobRole, jobType, jobStatus, salary )
    let id = req.params.id;
    // console.log(id)
    let updatedJob = await Job.findByIdAndUpdate(id, {
      companyName,
      jobRole,
      jobType,
      jobStatus,
      salary,
    },{returnDocument: 'after'}); //  returnDocument:'after' use beacuse we want instant update and send updated data to client

    return res.status(200).json({ mesage: "Update Successfully", updatedJob:updatedJob  });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.delete("/job/delete/:id",async(req,res)=>{

    try {
        const id=req.params.id
      
        const job= await Job.findByIdAndDelete(id)

        if(!job){
            return res.status(400).send("job not found")
        }
        
        return res.status(200).json({message:"job deleted",deletedJob:job})

    } catch (error) {

        return res.status(400).json({message:"Error while delteting job"})
        
    }
})

app.listen(3000, () => {
  connectDB();

  console.log("server is running on 3000");
});
