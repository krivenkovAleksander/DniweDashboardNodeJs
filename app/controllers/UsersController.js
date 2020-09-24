
import UserModel from '../../models/Users.js';
// import jwtToken from 'jsonwebtoken';
import crypto from 'crypto'
import bcrypt from 'bcrypt';

let users = [
    {
      id: 1,
      username: 'test',
      password: 'asdf123',
    },
    {
      id: 2,
      username: 'test2',
      password: 'asdf12345',
    },
  ];
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
                    res.status(400).send({
                        status: 'error',
                        message: 'Пользователь с таким логином уже существует'
                    })
                } else {
                    
                    UsersAdd.save()
                    .then(()=>{
                                res.send({
                                    status: 'ok',
                                    message:'Вы успешно зарегестрировались'
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
                res.status(400).send({
                    status: 'error',
                    message: 'Не верный логин или пароль'
                })
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
                        console.log('ERROR');
                        res.status(400).send({
                            status: 'error',
                            message: 'Ошибка создания сессии пользователя, обратитесь куда нибудь'
                        })
                        return;
                    })
                   res.send({
                    status: 'ok',
                    message: 'Вы успешно авторизировались',
                    userSession: newUserSession,
                    userId: newUserId,
                   });
                   return;
                   
                } else {
                    res.status(400).send({
                        status: 'error',
                        message: 'Не верный логин или пароль'
                    })
                    return;
                }
            });
        })
      }
};