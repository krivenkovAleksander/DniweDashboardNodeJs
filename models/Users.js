import mongoose from 'mongoose';

const UserInfo = new mongoose.Schema({
    login:String,
    password: String,
    session: String,
    userId: String,
    firstName: String,
    secondName: String,
    ThirdName: String,
    score: Number,
    Permissions: String,
    Avatar: String,
}, {
    timestamps: true,
})
const UserInfoModel = mongoose.model('users', UserInfo);

export default UserInfoModel;

