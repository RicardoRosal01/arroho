const express = require('express')
const Router = express.Router()

Router.get('/',(req,res)=>{
    res.render('clave')
})

Router.post('/',(req,res)=>{
    let mensagem = 'clave incorreta'
    if (req.body.clave == "XMG3-Rel.1") {
        res.render('index')
    } else {
        res.render('clave',{mensagem:mensagem})
    }
})

Router.get('/carga',(req,res)=>{
    res.render('claveCarga')
})

Router.post('/carga',(req,res)=>{
    let mensagem = 'clave incorreta'
    if (req.body.clave == "XMG3-Rel.1") {
        res.render('cargaTermica')
    } else {
        res.render('clave',{mensagem:mensagem})
    }
})

module.exports = {Router}