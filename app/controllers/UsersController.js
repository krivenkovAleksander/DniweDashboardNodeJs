
import UserModel from '../../models/Users.js';
// import jwtToken from 'jsonwebtoken';
import crypto from 'crypto'
import bcrypt from 'bcrypt';


const BCRYPT_SALT_ROUNDS = 12;
export default class UsersController {

    GetUsers(req, res)  {
        UserModel.find().then((err, posts) => {
            if(err)
            {
                res.send(err);
            }
        }).catch(_err => {
            console.log(_err);
        })
    };
    RegisterUser(req,res) {
        const data = req.body;
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            const UsersAdd = new UserModel({
                login:data.login,
                password: hashedPassword,
                firstName: "",
                secondName:"",
                ThirdName: "",
                score: 0,
                Permissions: "user",
                Avatar: '',
                sesion: '',
                userId: '',
            });
            UserModel.findOne({login: data.login}).then(data => {
                if(data)
                {
                    res.status(400).send('UserExist')
                } else {
                    
                    UsersAdd.save()
                    .then(()=>{
                                res.send({
                                    status: 'ok',
                                    message:'Вы успешно зарегистрировались'
                                })
                            });
                }
            })

        })
    };
    LoginUser(req, res) {
        const {login, password} = req.body;
        UserModel.findOne({login: login}).then((userInfo) => {
            if( userInfo === null){
                res.status(400).send('WrongLoginOrPassword');
                return;
            }
            bcrypt.compare(password, userInfo.password)
            .then(samePassword => {
                if(samePassword){
                    let newUserSession =  crypto.randomBytes(64).toString('hex');
                    let newUserId = crypto.randomBytes(8).toString('hex');
                    
                    UserModel.findByIdAndUpdate(userInfo._id, {$set:{
                        session: newUserSession,
                        userId: newUserId,
                    }}, (err) => {
                        console.log('ERROR', err);
                        if(!err)
                        {
                            res.send({
                                    status: 'ok',
                                    message: 'Вы успешно авторизировались',
                                    userSession: newUserSession,
                                    userId: newUserId,
                            });
                            return;
                        } else 
                        {
                            res.status(400).send('SessionCreateError');
                            return;
                        }
                        
                    }).then(info => {
                        console.log("Success", info);
                    });
                } else {
                    res.status(400).send('WrongLoginOrPassword');
                    return;
                }
            });
        })
    };
    VerifyUser(req, res) {
        const {session, id} = req.body;
        console.log(req.body);
        UserModel.findOne({session: session, userId: id}).then((userInfo) => {
            
            console.log("ErrorSend", userInfo);
            if( userInfo === null){
                res.status(400).send('errorSessionVerification')
                return;
            } else {
                res.status(200).send({
                    status: 'ok',
                    payload: {
                        firstName: userInfo.firstName,
                        secondName: userInfo.secondName,
                        thirdName: userInfo.ThirdName,
                        Avatar: userInfo.Avatar,
                        Permissions: userInfo.Permissions,
                        score: userInfo.score,

                    },
                });
                return;
            }
        })
    };
};