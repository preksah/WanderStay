const mongoose = require("mongoose");
const InitialiseData=require("./data.js");
const Listing=require("../Models/listing.js");

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

const initDB=async ()=>{
	// clean data first by deleting
	await Listing.deleteMany({});
	InitialiseData.data=InitialiseData.data.map((obj)=>({...obj,owner:"69483e68446090f4375edcc5",
}));
	await Listing.insertMany(InitialiseData.data);
	console.log("Data was initialised");
}

initDB();