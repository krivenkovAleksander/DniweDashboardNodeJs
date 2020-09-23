
import PostModel from '../../models/Post.js';

export default class PostController {

    index(req, res)  {
        PostModel.find().then((err, posts) => {
            console.log("index");
            if(err)
            {
                res.send(err);
            }
        }).catch(_err => {
            console.log(_err);
        })
    }

    create(req, res)  {
        console.log("Create");

        const data = req.body;
        const post = new PostModel({
            title:data.title,
            text:data.text
        });
        post.save().then(()=>{
            res.send({status: 'ok'})
        })
    }
    read(req, res) {
        console.log("Read");

        PostModel.finOne({_id: req.params.id}).then(post => {
            if(!post){
                res.send({error:"Ошибка чтения"})
            }
            else {
                res.json(post);
            }
        });
    }
    update(req,res)  {
        console.log("Update");

        PostModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (err) => {
            if(err) {
                res.send(err);
            }
            res.json({status: "updated"});
        })
    }
    delete(req,res) {
        console.log("Delete");

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
    }
};