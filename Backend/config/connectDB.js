import mongoose from "mongoose"

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'SkillUp' // Match the existing database name (capital S and U)
        });
        console.log("✅ DB connected successfully");
    } catch (error) {
        console.error("❌ DB connection error:", error.message);
        // Don't exit, let the app run (some features might work without DB)
    }
}

export default connectDb
