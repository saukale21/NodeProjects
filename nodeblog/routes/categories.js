var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');
    posts.find({category: req.params.category},{}, function(err, posts){
        res.render('index',{
            'title': req.params.category,
            'posts': posts
        })
    })
});

router.get('/add', function(req, res, next) {
    res.render('addcategory', {
        title:'Add Category'
    });
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var categories  = db.get('categories');
    categories.insert({
        "name": name
    }, function(err, posts) {
        if (err) {
            res.send(err);
        }
        else {
            req.flash('success','Category Added');
            res.location('/');
            res.redirect('/');
        }
    });

  });

module.exports = router;
