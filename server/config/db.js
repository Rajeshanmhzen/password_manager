import mongoose from "mongoose"

const connectDB= async()=>{
    try {
        const conn=await mongoose.connect(process.env.DB_KEY)
        console.log(`MongoDB connected successfully`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB