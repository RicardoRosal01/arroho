const express = require('express')
const Router = express.Router()

Router.get('/',(req,res)=>{
    res.render('index')
})

Router.get('/carga',(req,res)=>{
    res.render('cargaTermica')
})

module.exports = {Router}