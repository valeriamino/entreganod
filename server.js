'use strict'

const mongoose = require("mongoose");
var app = require('./app');
var port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://flaquitavalem:1wrXYCa29ndz0xTc@cluster0.02isbkw.mongodb.net/trabnode")
/*mongoose.connect("mongodb+srv://flaquitavalem:660f40fc3786021ecf865bbb@cluster0.02isbkw.mongodb.net/trabnode")*/
        .then(() => {
            console.log("Conexión a la base de datos conocida con éxito")
            var server = app.listen(port, () => {
                console.log(`Example app listening on port ${port}`)
            });
            server.timeout = 120000;
        })
        .catch(err => console.log(err))


