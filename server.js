require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const ejsLayout = require('express-ejs-layouts');
const port = process.env.port || 8000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');

// Database Connection
mongoose.set('strictQuery', true);
const url = 'mongodb://localhost/Drink';
mongoose.connect(url, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
}).on('error', (err) => {
    console.log('Connection failed...', err);
})

// Session Store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// session Config
app.use(session({
    secret: process.env.Cookies_Secret,
    resave: false,
    store: mongoStore,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 1 } //1 hours

}))

// passport Config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// using Express Flash
app.use(flash());

// Assests from css and js
app.use(express.static('public'));

// Using urlencoded
app.use(express.urlencoded({ extended: false }));

// Using json in express
app.use(express.json());

// Using Session global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next()
})


// Set the template engine
app.use(ejsLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

// set the routes
require('./routes/web')(app)

// Running the server on port
const server = app.listen(port, () => {
    console.log(`Listing on port ${port}`);
})

// Running socket io
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // join
    socket.on('join', (roomName) => {
        socket.join(roomName)
    })
})

// running the emitter
eventEmitter.on('orderupdated', (data) => {
    io.to(`order_${data.id}`).emit('orderupdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})