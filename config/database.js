import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const connectDatabase = async () => {
  try {
    const con = await mongoose.connect(String(process.env.MONGO_DB_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\nMONGO DB CONNECTION IS SUCCESSFUL!: ${con.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

export default  connectDatabase;
