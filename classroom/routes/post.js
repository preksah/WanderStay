const express=require("express");
const app=express();
const router=express.Router();

// router.get("\",(req,res)=>{
// 	console.log("Hello get route");	
// })

// Index-posts
router.get("/",(req,res)=>{
	res.send("GET for post");
})

// Show-posts
router.get("/:id",(req,res)=>{
	res.send("GET for post id");
});

// Post-posts
router.post("/",(req,res)=>{
	res.send("POST for post");
})

// Delete-posts
router.delete("/:id",(req,res)=>{
	res.send("DELETE for post");
})

module.exports=router;