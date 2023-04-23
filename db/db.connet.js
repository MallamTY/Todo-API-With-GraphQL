import mongoose from "mongoose";



const connectDB = async (URI) => {
    return mongoose.connect(URI)
    .then(() => {
        console.log(`\n Connection to database established ...`);
    })
}

export default connectDB;
