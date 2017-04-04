// REQUIRE LIBRARIES
const express = require ('express')
const Sequelize = require ('sequelize')
const bodyParser = require ('body-parser')
const app = express ()
const session = require('express-session')

//REQUIRE MODULES
const db = require(__dirname + '/models/db.js')

//SETTING THE VIEW FOLDER AND ENGINE
app.set('views','./views');
app.set('view engine', 'pug');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to ssupport URL-encoded bodies
	extended: false
})); 

app.use(express.static(__dirname + '/static'));

app.use(session({
	secret: 'oh wow very secret much security',
	resave: true,
	saveUninitialized: false
}));

// ROUTES

// LWHEN LOGOUT DESTROY FUNCTION
app.get('/logout', function (request, response) {
	if (request.session.user) {
		request.session.destroy(function(){
			response.redirect('/');
		});
	} else {
		response.redirect("/login");
	}
});

// SHOW ALL PLANTS ON OFFERS PAGE
app.get('/offers', (request, response) => {

	user = request.session.user  	
	if(user === undefined) {		// CHECK IF USER IS LOGGED IN 
		response.redirect('/')		// IF NOT REDIRECT TO HOME
	}
	else {

		
		db.Plant.findAll(			// FIND ALL PLANTS AND INCLUDE USER TABEL

		{
			include: [db.User]
		}
		).then((allPlants) => {		
			const addresses = []
			for (var i = 0; i < allPlants.length; i++) {
				const address = allPlants[i].user.address + " " + allPlants[i].user.houseNumber + ", " + allPlants[i].user.city + ", The Netherlands"
				addresses.push(address) //PUSHES AFRESS IN ARRAY ADDRESSES
			}

			response.render('offers',	// RENDERS OFFER PAGE AND PASSES DATA ALONG TO FRONT IN OBJECT
			{
				allPlants: allPlants,
				name: request.session.user.userName,
				addresses: JSON.stringify(addresses)
			})
		})
	}
})


// HOME PAGE
app.get('/', function (request, response){
	response.render('index',				// RENDERS OFFER PAGE AND PASSES DATA ALONG TO FRONT IN OBJECT
	{
		user: request.session.user
	});
})


// BUTTON ON HOME PAGE
app.post('/', function (request, response){
	user = request.session.user
	if(user === undefined) {				// IF YOU CLICK ON BUTTON AND ARE NOT LOGGED IN REDIRECT TO HOME 
		response.redirect('/login')
	}
	else {
		response.redirect('/offers')		// IF YOU CLICK ON BUTTON AND ARE LOGGED IN REDIRECT TO OFFERS
	}
})

// LOG IN PAGE
app.get('/login', function (request, response){
	response.render('login', {				// RENDERS LOGING PAGE AND SENDS SESSION INFO TO FRONT
		user: request.session.user
	});
})

app.post('/login', function(request, response){
	if(request.body.email.length === 0) {	// IF EMAIL INPUT IS EMPTY REDIRECT TO HOME WITH MESSAGE IN URL
		response.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}

	if(request.body.password.length === 0) { // IF PASSWORD INPUT IS EMPTY REDIRECT TO HOME WITH MESSAGE IN URL
		response.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}
	db.User.findOne({						// FINDS ONE USER IN DATABASE WHERE EMAIL MATCHES TYPED IN EMAIL
		where:{
			email: request.body.email
		}
	}).then(function(user){					
		console.log(user)
		if (user !== null && request.body.password === user.password){ //IF USER IS NOT NULL AND PASSWORD MATCHES 
			request.session.user = user; 							   // PASWORD IN DATABASE 
			response.redirect('/offers');							   // THEN REDIRECT TO OFFERS
		} else {
			response.redirect('/?message'+ encodeURIComponent("Invalid email or password")); // ELSE GIVE MESSAGE IN URL
		}
	}, function (error){
		response.redirect('/?message'+ encodeURIComponent("Invalid email or password")); // WHEN ERROR GIVE MESSAGE IN URL
	});
});

// SIGN UP
app.get('/signup', function (request, response){
	response.render('signup')						// RENDERS THE SIGN UP PUG FILE
});

app.post('/signup', function(request, response){
	db.User.create({							// WHEN USER SIGNS UP DATA IS STORED IN DATABASE
		name: request.body.name,
		userName: request.body.userName,
		email: request.body.email,
		password: request.body.password,
		address: request.body.address,
		houseNumber: request.body.houseNumber,
		zipcode: request.body.zipcode,
		city: request.body.city
	}).then(function(){
		response.redirect("/login")			// THEN REDIRECT TO LOGIN 
	})
})

// ADD PLANT
app.get('/addplant', function (request, response) {
	user = request.session.user
	if(user === undefined) {
		response.redirect('/')				// CHECK IF USER IS LOGGED IN, IF NOT REDIRECT TO HOME 
	}
	else {
		response.render('addplant')			// IF USER IS LOGGED IN RENDER ADDPLANT PUG FILE
	}
})

app.post('/newplant', bodyParser.urlencoded({extended: true}), function(request, response) {
	db.Plant.create({						// ADD NEW PLANT IN THE DATABASE
		plantName: request.body.newPlantName,
		description: request.body.newDescription,
		userId: request.session.user.id  	// CONNECT IT WITH USER THROUGH USERID
	}).then( (newPlant) =>{
		response.redirect('/offers')
	})
})


// VIEW A SPECIFIC PLANT
app.get('/grabplant', (request, response) => {
	console.log(request.query.id)
	user = request.session.user;				
	db.Plant.findOne({					//FIND ON PLANT WHERE ID MATCHES WITH QUERY ID
		where: {
			id: request.query.id
		},    
		include: [db.User]
	})
	.then((onePlant) => {
		response.render('grabplant', { // RENDERS GRABPLANT PLUS AND PASSES DATA TO FRONT
			onePlant:onePlant})
	})
})

// STARTING THE SERVER
app.listen(process.env.PORT || 3000, function(){
	console.log("The server has started")
})