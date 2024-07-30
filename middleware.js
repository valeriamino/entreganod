'use strict'
require('dotenv').config();
var jwt = require("jsonwebtoken");

var middleware = {

    userprotectUrl: function (req, res, next) {

        const token = req.headers ['x-trabnode-access-token'];

        if (token){

            jwt.verify(token, process.env.KEY, (error, decoded) => {
                if (err) {
                    return res,atatus(401).send({
                        status:401,
                        message:"Token no valido"
                    });

                }else{

                    req.decoded = decoded;
                    next();

                }
            } );



        } else {
            return res.status(401).send({
                status:401,
                message:"Datos no validos"
            });
        }


    }

};

module.exports = middleware;