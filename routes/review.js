const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../Models/reviews.js");
const Listing =require("../Models/listing");
const {listingSchema}=require("../schema.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");
const review=require("../Models/reviews.js")
// validate Review


// Post Route-->try to save before show

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;