const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing =require("./Models/listing");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError.js");
const { error } = require("console");
const Review=require("./Models/reviews.js");

// Joi
const {listingSchema}=require("./schema.js");
// const {re}
const {reviewSchema}=require("./schema.js");


app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");

// css
app.use(express.static(path.join(__dirname, "/public")));

// to call main fn
main()
	.then(()=>{
	console.log("connected to db");
	})
	.catch(()=>{
		console.log(err);
	})
// for creating db, we will write an async fn 
async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/WanderStay');
}

app.get("/",(req,res)=>{
	res.send("Hi, I m a root");
});

// Index Routing
app.get("/listings", async (req, res) => {
		const listings = await Listing.find({});
    	res.render("listings/index", { listings });  // pass the listings to the template    
});



// create new
app.get("/listings/new",(req,res)=>{
	res.render("listings/new.ejs");
});

const validateListing=(req,res,next)=>{
	let {error}=listingSchema.validate(req.body);
	if(error){
		let errMsg=error.details.map((el)=>el.message).join(",");
		throw new ExpressError(400,errMsg);
	}else{
		next();
	}
};

// validate Review
const validateReview=(req,res,next)=>{
	let {error}=reviewSchema.validate(req.body);
	if(error){
		let errMsg=error.details.map((el)=>el.message).join(",");
		throw new ExpressError(400,errMsg);
	}else{
		next();
	}
}

// after submitting the form
app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
	// if(!req.body.listings){
	// 	throw new ExpressError(400,"Send valid data for listing");
	// }
	// if(!req.body.title){
	// 	throw new ExpressError(400,"Title is missing");
	// }
	// if(!req.body.description){
	// 	throw new ExpressError(400,"Description is missing");
	
	let result=listingSchema.validate(req.body);
	console.log(result);
if(result.error){
	throw new ExpressError(400,result.error);
}

	let {title,description,image,price,location,country}=req.body;

	const imageUrl =
    image === "" || !image
      ? "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop"
      : image;
	
	const newList = new Listing({
    title,
    description,
    image: {
      url: imageUrl,
      filename: "placeholder" // or leave empty if you're not using Cloudinary
    },
    price,
    location,
    country
  });
	await newList.save()
	console.log("List was saved");
	res.redirect("/listings");
}));

// for editing
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
	let {id}=req.params;
	const findList=await Listing.findById(id);
    console.log(findList); // 👈 Add this line
	res.render("listings/edit.ejs",{findList});
}));

// save the edit
app.put("/listings/:id", validateListing,wrapAsync(async (req,res)=>{
	let {id}=req.params;
	 const imageUrl =
    req.body.image === "" || !req.body.image
      ? "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop"
      : req.body.image;

	await Listing.findByIdAndUpdate(id, {
  title: req.body.title,
  description: req.body.description,
	image: {
		url: imageUrl
	},
	  price: req.body.price,
  location: req.body.location,
  country: req.body.country
});
	res.redirect(`/listings/${id}`);
}));

// Delete
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
	let {id}=req.params;
	let deleted= await Listing.findByIdAndDelete(id,{...req.body.Listing});
	console.log(deleted);
	res.redirect("/listings");

}));

// Reviews
// Post Route-->try to save before show

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
	let listing=await Listing.findById(req.params.id);

	// create new review after submitting the form
	let newReview=new Review(req.body.review);

	listing.reviews.push(newReview);

	await newReview.save();
	await listing.save();

	// console.log("new review saved");
	// res.send("new review saved");
	res.redirect(`/listings/${listing._id}`);
}));

// Delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
	let {id, reviewId}=req.params;
	// to delete in listing too
	await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
	await Review.findByIdAndDelete(reviewId);

	res.redirect(`/listings/${id}`);
}))

// show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
	let {id}=req.params;

	const read=await Listing.findById(id).populate("reviews");
	res.render("listings/show.ejs",{read});
}));
 
// app.get("/testListing",async (req,res)=>{
// 	let sampleListing=new Listing({
// 		title:"New Villa",
// 		description:"Near the beach",
// 		price:3000,
// 		location:"Goa",
// 		country:"India",
// 	});
// 	await sampleListing.save();
// 	console.log("Sample was saved");
// 	res.send("Successful testing");
// });

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// error handling
app.use((err,req,res,next)=>{
	let {statusCode=500,message="Something went wrong!"}=err;
	res.status(statusCode).render("error.ejs",{message});
	// res.status(statusCode).send(message);
});

app.listen(8080,()=>{
	console.log("server is listening to post 8080");
});