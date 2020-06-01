const express = require('express')
const Router = express.Router()

Router.get('/',(req,res)=>{
    res.send('agora vai')
})

Router.post('/',(req,res)=>{
    let horas,dados
    horas = qtdHoras(req.body.diasPMes,req.body.horasPDia)
    dados = economia(req.body.vazao,horas,req.body.renovacaoDeAr,req.body.temperaturaExterna,req.body.setpoint,req.body.deltat)
    res.render('index',{dados:dados})
})

module.exports = {Router}

const economia = function(vazao,qtdHoras,renovacao,temperaturaExterna,setpoint,deltaT){
    let energiaAtual,energiaProjetada,economia,deltaTAutomacao,densidade,calorEspecifico,temperaturaRetorno,temperaturaMistura,taxaTR,trAtual,trProjecao
    
    densidade = 997
    calorEspecifico = 4.184
    temperaturaRetorno = 27
    taxaTR = 3.52
    temperaturaMistura = (temperaturaRetorno * (1 - (renovacao / 100))) + (temperaturaExterna * (renovacao / 100))
    deltaTAutomacao = temperaturaMistura - setpoint < 0 ? 0 : temperaturaMistura - setpoint

    energiaAtual = ((vazao * qtdHoras) * densidade) * calorEspecifico * deltaT
    trAtual = (energiaAtual / (qtdHoras * 3600)) / taxaTR

    energiaProjetada = ((vazao * qtdHoras) * densidade) * calorEspecifico * deltaTAutomacao
    trProjecao = (energiaProjetada / (qtdHoras * 3600)) / taxaTR

    economiaNF = (energiaAtual - energiaProjetada)/energiaAtual
    economia = economiaNF.toFixed(2)

    return {energiaAtual,energiaProjetada,trAtual,trProjecao,economia}
}

const qtdHoras = function(dias,horas){
    let qtdHoras
    qtdHoras = dias*horas
    return qtdHoras
}