const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
// cookies
const cookieParser=require("cookie-parser");

// express session
const session=require("express-session");
app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));
// app.get("/test",(req,res)=>{
// 	res.send("test successful!");
// });
app.get("/reqcnt",(req,res)=>{
	if(req.session.count){
		req.session.count++;
	}else{
		req.session.count=1;
	}
	res.send(`You send a request ${req.session.count} times`);
});


app.use(cookieParser("secretcode")); //middleware

// signed cookie
app.get("/getsignedcookie",(req,res)=>{
	res.cookie("madeIn","India",{signed:true});
	res.send("signed cookie sent");
})
app.get("/getcookies",(req,res)=>{
	res.cookie("greet","hello");
	res.cookie("madeIn","India");
	res.send("send yousome cookies");
})
app.get("/verify",(req,res)=>{
	console.log(req.cookies); //unsigned cookies
	console.log(req.signedCookies); //unsigned cookies
	res.send("verified");
})
// usage
app.get("/greet",(req,res)=>{
	let {name="anonymous"}=req.cookies;
	res.send(`Hell0 ${name}`);
});

app.get("/",(req,res)=>{
	console.dir(req.cookies);
	res.send("Hi, I am root!");
})

app.use("/users",users);
app.use("posts/",posts);

//express sessions->stateful & stateless



app.listen(3000,()=>{
	console.log("server is listening to 3000");
})


