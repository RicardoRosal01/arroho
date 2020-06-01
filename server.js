//checando as variaveis de ambiente
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//importando as dependências
const express = require('express')
const app = express()
const expressLayouts = require ('express-ejs-layouts')
const BodyParser = require('body-parser')
const methodOverride = require('method-override')

//importando as rotas
const indexRouter = require('./routes/index')
const sistemaRouter = require('./routes/sistemas')

//configurações da aplicação
app.set('view engine','ejs') 
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(BodyParser.urlencoded({limit:'10mb',extended:false}))
app.use(methodOverride('_method'))

//inserindo as rotas
app.use('/',indexRouter.Router)
app.use('/sistemas',sistemaRouter.Router)

app.listen(process.env.PORT || 3000,()=>{
    console.log(`servidor rodando na porta ${process.env.PORT}`)
})