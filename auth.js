'use strict'

var jwt = require("jsonwebtoken");

const {validationResult } = require('express-validator');

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

            if(data.password == usuarios.password){

                const payload = {
                    user: usuarios
                }

                let access_token = jwt.sign(payload, privateKey, {
                    expiresIn: 'id'

                });

                let today = new Date().toISOString();

                let update_session = {
                    user: usuarios.email,
                    key: access_token,
                    creationDate: today,
                    expirationDate: '1d',
                    active: true

                }

                Sessions.findOneAndUpdate({ user:usuarios.email}, update_session)
                .then(session => {
                    if (!session) {
                        return res.status(401).send({
                            status: 401,
                            message: "Usuario no encontrado"
                        });
                        }

                        return res.status(200).send({
                        status: 200,
                        message: "Usuario actualizado"
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(500).send({
                        status: 500,
                        message: "Error detectado"
                        });
                    });
                
                    return res.status(200).send({
                        status:200,
                        message:"Login correcto",
                        token: access_token
                    });

            }else{
                return res.status(401).send({
                    status:401,
                    message:"Datos no validos"
                });
            }    
        })
        .catch(error => {
            console.error(error);
            return res.status(401).send({
                status:401,
                message:"Datos no validos"
            });
        });

    }
}

module.exports = controller;
