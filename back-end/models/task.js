import mongoose from "mongoose";
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["todo", "doing", "done"],
            required: true
        },
        priority: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)
taskSchema.index({ createdAt: -1, status: 1 })
export default mongoose.model("task", taskSchema)