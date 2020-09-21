import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title:String,
    text: String,
}, {
    timestamps: true,
})
const Post = mongoose.model('Post', PostSchema);

export default Post;

