
import express from 'express';
import MongoClient from 'mongodb';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import PostModel from './models/Post.js';
// import Post from './models/Post.js';
// const bodyParser  = require('body-parser');
// const mongoose = require('mongoose');
const port = 8000;

mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.post('/posts', (req, res) => {
    const data = req.body;
    const post = new PostModel({
        title:data.title,
        text:data.text
    });
    post.save().then(()=>{
        res.send({status: 'ok'})
    })
})
app.get('/posts', (req, res) => {
    PostModel.find().then((err, post) => {
        if(err) {
            res.send(err);
        }
        res.json(post);
    })
})
app.delete('/posts/:id', (req,res) => {
    PostModel.remove({
        _id: req.params.id
    }).then(post => {
        if(post)
        {
            res.json({status: 'deleted'});
        } else {
            res.json({status: 'delete_error'})
        }
    })
})
app.put('/posts/:id', (req,res) => {
    PostModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (err) => {
        if(err) {
            res.send(err);
        }
        res.json({status: "updated"});
    })
})
app.listen(port, () => {
  console.log('We are live on ' + port);
});

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));



// const posts = [{
//     title:'123',
//     text:'654321'
// }, {
//     title:'aaaa',
//     text:'bbbb',
// }]
// require('./app/routes')(app, {});
// app.get('/posts', function(req,res) {
//     return res.send(posts);
// })
// app.get('/posts/:id', function(req,res) {
//     const id = req.params.id;
//     return res.send(posts[id]);
// })
// app.post('/posts', function(req,res){
//     const data = req.body;
//     posts.push(data);
//     return res.send(posts);
// })
