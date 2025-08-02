const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing =require("./Models/listing");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');


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

// after submitting the form
app.post("/listings",(req,res)=>{
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
	newList.save()
	.then(res=>{console.log("List was saved")})
	.catch(err=>{console.log(err)})
	res.redirect("/listings");
})

// for editing
app.get("/listings/:id/edit",async(req,res)=>{
	let {id}=req.params;
	const findList=await Listing.findById(id);
    console.log(findList); // 👈 Add this line
	res.render("listings/edit.ejs",{findList});
});

// save the edit
app.put("/listings/:id",async (req,res)=>{
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
});

// Delete
app.delete("/listings/:id",async (req,res)=>{
	let {id}=req.params;
	let deleted= await Listing.findByIdAndDelete(id,{...req.body.Listing});
	console.log(deleted);
	res.redirect("/listings");

});
// show route
app.get("/listings/:id", async(req,res)=>{
	let {id}=req.params;

	const read=await Listing.findById(id);
	res.render("listings/show.ejs",{read});
})

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


app.listen(8080,()=>{
	console.log("server is listening to post 8080");
});

