var express=require('express'),
	app=express(),
	mongoose = require('mongoose'),
	flash=require('connect-flash'),
	bodyParser=require('body-parser'),
	passport=require('passport'),
	LocalStrategy=require('passport-local'),
	methodOverride=require('method-override'),
	Campground=require('./models/campground'),
	Comment=require('./models/comment'),
	User=require('./models/user'),
	seedDB=require('./seeds');

//requiring routes
var commentRoutes=require('./routes/comments'),
	campgroundRoutes=require('./routes/campgrounds'),
	indexRoutes=require('./routes/index');

// mongoose.connect('mongodb://localhost/yelp_camp')
mongoose.connect('mongodb+srv://course:Sakshi@cluster0-cj15q.mongodb.net/yelp_camp?retryWrites=true&w=majority'
,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB();  //seed the database

//Passport configuration
app.use(require('express-session')({
	secret:'secretcode',
	resave:false,
	saveUninitialized:false	
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//authenticate,serializeUser,deserializeUser method from plugin of passportLOcalMongoose defined in user.js of models 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//since header uses currentUser,and header is in all routes rather than passing this throught each route better way is:
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash('error');
	res.locals.success=req.flash('success');
	next();
});

app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);//takes all the routes from routes/campgrounds.js and appends /campgrounds in front of it 
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Campscape server Started!");
});
