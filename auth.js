'use strict'

require('dotenv').config();

var jwt = require("jsonwebtoken");

const {validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

var Users = require('../models/users');
var Sessions = require('../models/accesstoken');

var controller = {

    login_user: function (req,res){

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({status:400, errors: errors.array()});
        }

        var data = req.body;

        Users.findOne({email:data.email})
        .then(usuarios => {

            //bcrypt
            bcrypt.compare(data.password, usuarios.password, function(err, result) {
                // result == true
                if(result){

                    const payload = {
                        user: usuarios
                    }
    
                    let access_token = jwt.sign(payload, process.env.KEY, {
                        expiresIn: '3d'
    
                    });
    
                    let today = new Date().toISOString();
    
                    let update_session = {
                        user: usuarios.email,
                        key: access_token,
                        creationDate: today,
                        expirationDate: '3d',
                        active: true
    
                    }
    
                    Sessions.findOneAndUpdate({ user:usuarios.email}, update_session, {upsert:true, new:true})
                    .then(session => {
                        if (!session) {
                            return res.status(401).send({
                                status: 401,
                                message: "Usuario no encontrado"
                            });
                        }
    
                        return res.status(200).send({
                            status:200,
                            message:"Login correcto",
                            token: access_token
                        });
    
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status: 500,
                            message: "Error detectado"
                        });
                    });
                    
                        
    
                }else{
                    return res.status(401).send({
                        status:401,
                        message:"Datos no validos"
                    });
                }

            });

                
        })
        .catch(error => {
            console.error(error);
            return res.status(401).send({
                status:401,
                message:"Datos no validos"
            });
        });

    },

    logout: function (req, res){
        const token = req.headers ['x-trabnode-access-token'];
        console.log(token);

        Sessions.findOneAndDelete({user:req.decoded.user.email,key:token})
        .then(session => {
    
          if (!session) {
            return res.status(404).send({
              status: 404,
              message: "Token invalido"
            });
          }
    
          return res.status(200).send({
            status: 200,
            message: "Sesion finalizada"
          });
        })
        .catch(error => {
          console.error(error);
          return res.status(500).send({
            status: 500,
            message: "Token invalido"
          });
        });

    }


}

module.exports = controller;
