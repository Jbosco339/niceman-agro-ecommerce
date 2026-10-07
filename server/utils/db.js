import mongoose from "mongoose"



const connect = async ()=>{
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
    return connection;
}

export default connect;