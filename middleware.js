'use strict'

require('dotenv').config();
var jwt = require("jsonwebtoken");

var Sessions = require('../models/accesstoken');

var middleware = {

    userprotectUrl: function (req, res, next) {

        const token = req.headers ['x-trabnode-access-token'];

        if (token){

            jwt.verify(token, process.env.KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        status:401,
                        message:"Token no valido"
                    });

                }else{

                    req.decoded = decoded;

                    Sessions.findOne({ email:req.decoded.user.email, token, active:true })
                    .then(session => {

                        if(!session){
              
                            return res.status(401).send({
                                status: 401,
                                message: "Usuario no enontrado",
                        
                            });
                        }
                        returnres.status(200).send({
                            status:200,
                            message:"Informacion de usuario",
                            data:usuarios
                        });
                    })    
                    .catch(error => {
                      console.error(error);
                      return res.status(500).send({
                        status: 500,
                        message: "Error detectado"
                      });
                    });


                    next();

                }
            });

        } else {
            return res.status(401).send({
                status:401,
                message:"Datos no validos"
            });
        }


    }

};

module.exports = middleware;