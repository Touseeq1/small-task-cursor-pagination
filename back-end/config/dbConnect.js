import mongoose from "mongoose"
export const connectDatabase = () => {
    let DB_URL = ""
    if (process.env.NODE_ENV === "DEVELOPMENT") DB_URL = process.env.DB_LOCAL_URL;
    if (process.env.NODE_ENV === "PRODUCTION") DB_URL = process.env.DB_URL;

    mongoose.connect(DB_URL).then((con) => {
        console.log(`Mongo Databse Connect with Host:${con?.connection?.host}`)
    })
}