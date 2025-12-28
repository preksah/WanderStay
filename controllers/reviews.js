const Listing = require("../Models/listing");
const Review = require("../Models/reviews.js");


module.exports.createReview=async(req,res)=>{
	console.log(req.params.id);  //id pass nhi ho rhi req.params.id
	let listing=await Listing.findById(req.params.id);
	let newReview=new Review(req.body.review);
	newReview.author=req.user._id;
	console.log(newReview);
	listing.reviews.push(newReview);

	await newReview.save();
	await listing.save();

	req.flash("success","New Reviews created!");
	res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
	let {id, reviewId}=req.params;
	// to delete in listing too
	await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
	await Review.findByIdAndDelete(reviewId);

	req.flash("success","Listing deleted!");
	res.redirect(`/listings/${id}`);
};