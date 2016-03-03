var express = require('express');
var crypto = require('crypto');
var router = express.Router();

router.get('/',function(req,res,next) {
    var invalid = req.session.invalid;
    req.session.invalid = null;
    res.render('index',{title:'Welcome!',invalid:invalid});
});

router.post('/',function(req,res,next) {
    var invalid = req.session.invalid;
    req.session.invalid = null;
    res.render('index',{title:'Welcome!',invalid:invalid});
});

router.post('/newaccount',function(req,res,next) {
   res.render('adduser',{title:'Create Account',invalid:false}) 
});

router.get('/newaccount',function(req,res,next) {
    var invalid = req.session.invalid;
    req.session.invalid = null;
    res.render('adduser',{title:'Create Account',invalid:invalid}); 
});

router.post('/login',function(req,res,next){
    var hash = crypto.createHash('sha256');
    
    var db = req.db;
    var username = req.body.username;
   
    hash.update(req.body.password);
    var password = hash.digest('hex');
   // console.log(password);

    
    var collection = db.get('users');
    
    collection.find({'username':username},function(err,doc) {
        if(err) {
            console.log('problem');
            req.session.invalid = true;
            res.redirect('/');
        }
        else {
            if(password === doc[0].password) {
                req.session.username = username;
                res.redirect('/chat');
            }
            else {
                //console.log(doc[0].password);
                req.session.invalid = true;
                res.redirect('/');
            }
        }
    });
});

router.post('/createacc',function(req,res,next){
   //enter user to database 
    var hash = crypto.createHash('sha256');
    
    var db = req.db;
    var username = req.body.username;
    
    hash.update(req.body.password);
    var password = hash.digest('hex');
    
    
    var collection = db.get('users');
    collection.count({'username':username},function(err,count){
        if(err) {
            res.send('problem');
        }
        else {
            if(count > 0) {
                req.session.invalid = true;
                res.redirect('/newaccount');
            }
            else {
                collection.insert({
                    'username':username,
                    'password':password 
                }, function (err,doc) {
                    if(err) {
                        res.send('problem');
                    }
                    else {
                        
                        //token??
                        req.session.username = username;
                        res.redirect('/chat');
                        //redirect to chat room.
                    }
                });
            }
        }
    });
    
    
});

router.get('/chat',function(req,res,next){
    if(req.session.username == undefined) {
        res.redirect(403,'/');
    }
    else {
        res.render('chat',{title:'Chat: ' + req.session.username,username:req.session.username});
    }
    
});

module.exports = router;