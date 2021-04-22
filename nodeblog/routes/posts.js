var express = require('express');
//const multer = require('multer');
var multer = require('multer');
var upload = multer({dest: './public/images'})
var router = express.Router();

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');
    posts.findOne(req.params.id, function(err, post) {
        res.render('show', {
            'post': post
        });
    });
  
});

router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({},{}, function(err, categories) {
        res.render('addpost', {
            title:'Add Post',
            'categories': categories
        });
    });
  
});

router.post('/add', upload.single('mainimage'),function(req, res, next) {
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if(req.file) {
        var mainimage = req.file.filename;
    }
    else {
        var mainimage = 'noimage.jpg';
    }
    var posts  = db.get('posts');
    posts.insert({
        "title": title,
        "body": body,
        "category": category,
        "date": date,
        "author": author,
        "mainimage": mainimage
        
    }, function(err, posts) {
        if (err) {
            res.send(err);
        }
        else {
            req.flash('success','Post Added');
            res.location('/');
            res.redirect('/');
        }
    });

  });

router.post('/addcomment', function(req, res, next) {
var name = req.body.name;
var email = req.body.email;
var body = req.body.body;
var postid = req.body.postid;
var commentdate = new Date();

//var posts  = db.get('posts');
    var comment = {
        "name": name,
        "email": email,
        "body": body,
        "commentdate": commentdate
    }
    var posts = db.get('posts');
    posts.update({
        "_id": postid
    },{
        $push:{
            "comments": comment 
        }
    }, function(err, doc){
        if(err) {
            throw err;
        }
        else {
            req.flash('success', 'Comment Added');
            res.location('/posts/show/'+postid);
            res.redirect('/posts/show/'+postid);
        }
    });

});

module.exports = router;
