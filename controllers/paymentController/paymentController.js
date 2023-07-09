import orderModel from "../../models/payment/paymentModel.js";
import Razorpay from "razorpay"
 export const payment = async(req,res)=>{

    try {
      const {order_id,amount ,payment_capture} = req.body;



console.log("data",req.body);


              const razorpayInstance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRETS,
      });

      const option ={
       receipt: order_id,
        amount: amount * 100,
        currency: "INR",
        payment_capture:payment_capture
      }
      const order = await razorpayInstance.orders.create(option);
      if(!order) return res.status(500).send("somthing error")
  
      res.status(200).json({ success: true, data:order });

        
    } catch (error) {
        console.log(error);
    }
}


  


export const confirmOrder=async(req,res)=>{

    try {

      console.log("conform data ");
        const razorpayInstance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRETS,
          });
          console.log(req.body);


          const {orderId,userId,packageDatas}=req.body
          console.log(userId);
        

          const order = await razorpayInstance.orders.fetch(
            orderId
          );
       console.log(order);


          if(!order) return res.status(500).send("somthing error")
          if (order.status === "paid") {

            console.log("payment successs");

            const newOrder = new orderModel({
            
              amount:order.amount / 100,
              orderId:orderId,
              userId:userId,

             
      ...packageDatas


          })
          newOrder.save().then((data) => {
            res.status(200).json({ success: true, data:data });

          }).catch(() => {
              res.json({
                  status: false, message: "order not placed"
              })
          })

          }
    
        
    } catch (error) {
        
    }
}



