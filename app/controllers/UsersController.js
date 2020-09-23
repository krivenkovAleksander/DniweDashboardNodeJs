
import UserModel from '../../models/Users.js';
import jwtToken from 'jsonwebtoken';
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
            });
            UserModel.findOne({login: data.login}).then(data => {
                console.log(data);
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
        // console.log(req, res, jwtToken);
        console.log('req', req.body);
        const {username, password} = req.body;
        console.log(req.body);
        UserModel.findOne({login: username}).then((userInfo) => {
            // console.log(data);
            // console.log(username);
            // console.log(password);
            bcrypt.compare(password, userInfo.password)
            .then(samePassword => {
                console.log('SamePassword', samePassword);
                if(samePassword){
                    res.status(400).send({
                        status: 'error',
                        message: 'Вы успешно авторизировались'
                    })
                } else {
                    res.status(400).send({
                        status: 'error',
                        message: 'Не верный логин или пароль'
                    })
                }
            });
            res.status(400).send({
                        status: 'error',
                        message: 'Пользователь с таким логином уже существует'
                    })
            // if(data)
            // {
       
            // } else {
                
            //     UsersAdd.save()
            //     .then(()=>{
            //                 res.send({
            //                     status: 'ok',
            //                     message:'Вы успешно зарегестрировались'
            //                 })
            //             });
            // }
        })
        // Use your DB ORM logic here to find user and compare password
        // for (let user of users) {
        // //   console.log(username, user.username);
        // //   console.log(password, user.password);
        //   // I am using a simple array users which i made above
        //   if (
        //     username == user.username &&
        //     password ==
        //       user.password /* Use your password hash checking logic here !*/
        //   ) {
        //     //If all credentials are correct do this
        //     let token = jwtToken.sign(
        //       { id: user.id, username: user.username },
        //       'SuperSecretKey',
        //       { expiresIn: 129600 }
        //     ); // Sigining the token
        //     res.json({
        //       sucess: true,
        //       err: null,
        //       token,
        //     });
        //     break;
        //   } else {
      
        //   }
        // }
      }
};