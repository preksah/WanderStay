const express=require("express");
const router=express.Router();
let User=require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js");

router.get("/signup",userController.renderSigUP);
router.post("/signup",wrapAsync(userController.signUP));

// login
router.get("/login",userController.renderLogin);
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);

// logout
router.get("/logout",userController.logout);
module.exports=router;