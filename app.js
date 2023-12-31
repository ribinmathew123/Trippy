import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import userRoute from './routes/userRoutes/userRouter.js';
import adminRoute from './routes/adminRoutes/adminRouter.js'
import vendorRoute from'./routes/vendorRoutes/vendorRouter.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDatabase();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'https://trippy.ribin.site']
}));


app.options('*', cors());
app.use("/admin", adminRoute);
app.use('/vendor', vendorRoute)
app.use('/', userRoute);




app.listen(PORT, () => {
  console.log(`Connected to backend! Running port is ${PORT}`);
});
