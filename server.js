
import express from 'express';
import MongoClient from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import PostController  from './app/controllers/PostController.js';
import UsersController from './app/controllers/UsersController.js';

const Users = new UsersController();
const Post = new PostController();

const port = 8000;

mongoose.connect('mongodb://localhost:27017/DniweBoardBase', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  // next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MOCKING DB just for test

// LOGIN ROUTE
app.post('/login', Users.LoginUser);

// Error handling

app.get('/UsersController', Users.GetUsers);
app.post('/UserRegister', Users.RegisterUser);
// app.post('/posts', Post.create)
// app.get('/posts', Post.index);
// app.delete('/posts/:id', Post.delete);
// app.put('/posts/:id', Post.update);
// app.put('/posts/:id', Post.read);
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
