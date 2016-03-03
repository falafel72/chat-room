var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');


//still need socket.io to handle chat messaging
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/chat');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

var messages = [];

app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:'asdfjkl'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/',routes);
app.use('/users',users);

app.use(function(req,res,next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if(app.get('env') === 'development') {
    app.use(function(err,req,res,next){
        res.status(err.status || 500);
        res.render('error',{
            message: err.message,
            error:err
        });
    });
}

app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var chatio = io.of('/chat');
chatio.on("connection",function(socket){
    console.log('a user connected');
    chatio.emit('conn');
    socket.on("disconnect", function() {
        socket.broadcast.emit('discon');
        //var collection = db.get('messages');
        /*collection.insert(messages, function(err){
            if(err) {
                console.log('problem');
            }
        });
        messages = [];*/
        console.log('user disconnected');
    });
    socket.on('chat message',function(msg) {
        //console.log(msg);
        messages.push(msg);
        socket.broadcast.emit('chat message',msg); 
    });
    socket.on('usercon',function(message) {
        messages.push(message);
        socket.broadcast.emit('usercon',message);
    });
    socket.on('userdiscon',function(message){
        messages.push(message);
        socket.broadcast.emit('userdiscon',message);
    });
    
    //work on storing it in database
});


http.listen(9001,function(){
    console.log("Listening at localhost:9001");
});

module.exports = app;