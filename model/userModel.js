import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Internship","FullTime"],
      default: "Full-time",
    },
    jobStatus: {
      type: String,
      required: true,
      enum: ["Applied", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    salary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
