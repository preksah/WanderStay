const express=require("express");
const app=express();
const router=express.Router();

// router.get("\",(req,res)=>{
// 	console.log("Hello get route");	
// })

// Index-users
router.get("/",(req,res)=>{
	res.send("GET for user");
})

// Show-users
router.get("/:id",(req,res)=>{
	res.send("GET for user id");
});

// Post-users
router.post("/",(req,res)=>{
	res.send("POST for user");
})

// Delete-users
router.delete("/:id",(req,res)=>{
	res.send("DELETE for user");
})

module.exports=router;