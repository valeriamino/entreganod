'use strict'

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

var Users = require('../models/users');

var controller = {
  userlist: function(req, res) {
    
    Users.find({})
    .then(usuarios => {
      return res.status(200).send({
        status: 200,
        message: "Usuarios listados",
        data: usuarios
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        status: 500,
        message: "Error detectado"
      });
    });
  },

  userSingular: function(req, res) {
    var params = req.params;
    var iduser = params.iduser;

    Users.findOne({ iduser: parseInt(iduser) })
    .then(usuarios => {

      return res.status(200).send({
        status: 200,
        message: "Información de usuario",
        data: usuarios
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        status: 500,
        message: "Error detectado"
      });
    });
  },

  createuser: function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, errors: errors.array() });
    }

    var data = req.body;

    //Usuario existente

    Users.findOne({ iduser: data.iduser })
    .then(usuarios => {

      //Validacion de usuarios duplicados
      if (usuarios) {
        return res.status(400).send({
          status: 400,
          message: "Usuario ya existe"
        });
      }

      //Crip de pass
      const saltRounds = 10;
      bcrypt.genSalt(salRounds, function(err, salt){
        bcrypt.hash(data.password, salt, function(err, hash){
          //Store hash in your password DB.
          var create_user = new Users();
          create_user.iduser = data.iduser;
          create_user.name = data.name;
          create_user.apellido = data.apellido;
          create_user.edad = data.edad;
          create_user.propiedad = data.propiedad;
          create_user.email = data.email;
          create_user.password = hash;

          create_user.save()
            .then(result => {
              return res.status(201).send({
                status: 200,
                message: "Usuario creado",
                data: result
              });
            })
            .catch(error => {
              console.error(error);
              return res.status(500).send({
                status: 500,
                message: "Error detectado"
              });
            });

          });
        });

      })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        status: 500,
        message: "Error detectado"
      });
    });
  },

  updateuser: function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, errors: errors.array() });
    }

    var params = req.params;
    var iduser = params.iduser;

    var data = req.body;

    //Crip de pass
    const saltRounds = 10;
    bcrypt.genSalt(salRounds, function(err, salt){
      bcrypt.hash(data.password, salt, function(err, hash){

        var update_user = {
          iduser: data.iduser,
          name: data.name,
          apellido: data.apellido,
          edad: data.edad,
          propiedad: data.propiedad,
          email: data.email,
          password:data.hash
          
        };
    
        Users.findOneAndUpdate({ iduser: parseInt(iduser) }, update_user)
          .then(usuarios => {
            if (!usuarios) {
              return res.status(404).send({
                status: 404,
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

      });
    });    

  
  },

  deleteuser: function(req, res) {
    var params = req.params;
    var iduser = params.iduser;

    Users.findOneAndDelete({iduser: parseInt(iduser)})
    .then(usuarios => {

      if (!usuarios) {
        return res.status(404).send({
          status: 404,
          message: "Usuario no encontrado"
        });
      }

      return res.status(200).send({
        status: 200,
        message: "Usuario eliminado"
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        status: 500,
        message: "Error detectado"
      });
    });
  }
};

module.exports = controller;