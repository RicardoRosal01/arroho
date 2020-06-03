const express = require('express')
const Router = express.Router()

Router.get('/',(req,res)=>{
    res.render('index')
})

Router.post('/',(req,res)=>{
    let horas,dados
    horas = qtdHoras(req.body.diasPMes,req.body.horasPDia)
    dados = economia(req.body.vazao,horas,req.body.custoKWH,req.body.renovacaoDeAr,req.body.temperaturaExterna,req.body.setpoint,req.body.deltat)
    res.render('index',{dados:dados})
})

Router.post('/carga',(req,res)=>{
    let cargas = {}
    let total,_cargaIluminacao,_cargaTransmissao,_cargaPessoas
    _cargaPessoas = cargaPessoas(req.body.pessoas,req.body.tempo)
    _cargaIluminacao = cargaIluminacao(req.body.lampadas,req.body.tempoLampada,req.body.potencia)
    _cargaTransmissao = cargaTransmissao(0.59,req.body.area,req.body.tempout,req.body.tempin)
    total = _cargaPessoas + _cargaIluminacao + parseInt(_cargaTransmissao,10) 

    cargas.cargaTransmissao = _cargaTransmissao
    cargas.cargaPessoas = _cargaPessoas
    cargas.cargaIluminacao = _cargaIluminacao
    cargas.total = total.toFixed(2)
    res.render('cargaTermicaPT-BR',{cargas:cargas})
})

module.exports = {Router}

const economia = function(vazao,qtdHoras,custo,renovacao,temperaturaExterna,setpoint,deltaT){
    let energiaAtual,energiaProjetada,economia,deltaTAutomacao,densidade,calorEspecifico,temperaturaRetorno,temperaturaMistura,taxaTR,trAtual,trProjecao
    
    densidade = 997
    calorEspecifico = 4184/1000
    temperaturaRetorno = 27
    taxaTR = 352/100
    temperaturaMistura = (temperaturaRetorno * (1 - (renovacao / 100))) + (temperaturaExterna * (renovacao / 100))
    deltaTAutomacao = (temperaturaMistura - setpoint) < 0 ? 0 : (temperaturaMistura - setpoint)

    energiaAtualNF = ((vazao * qtdHoras) * densidade) * calorEspecifico * deltaT
    trAtualNF = (energiaAtualNF / (qtdHoras * 3600)) / taxaTR

    energiaProjetadaNF = ((vazao * qtdHoras) * densidade) * calorEspecifico * deltaTAutomacao
    trProjecaoNF = (energiaProjetadaNF / (qtdHoras * 3600)) / taxaTR

    //numeros formatados
    _energiaAtual = energiaAtualNF/1000000
    energiaAtual = _energiaAtual.toFixed(2)
    trAtual = trAtualNF.toFixed(2)
    _energiaProjetada = energiaProjetadaNF/1000000
    energiaProjetada = _energiaProjetada.toFixed(2)
    trProjecao = trProjecaoNF.toFixed(2)


    economiaNF = ((energiaAtual - energiaProjetada)/energiaAtual)*100
    economia = economiaNF.toFixed(2)
    economiaFinanceiraNF = economiaNF/100 * qtdHoras * trAtualNF * 0.7 * custo
    economiaFinanceira = economiaFinanceiraNF.toFixed(2)

    return {energiaAtual,energiaProjetada,trAtual,trProjecao,economia,economiaFinanceira}
}

const qtdHoras = function(dias,horas){
    let qtdHoras
    qtdHoras = dias*horas
    return qtdHoras
}

const cargaTransmissao = function(urate,area,tempout,tempin){
    let carga = (urate * (area*2 + Math.sqrt(area)*4 *2)*(tempout-tempin)*24)/1000
    return carga.toFixed(2)
}

const cargaPessoas = function(pessoas,tempo){
    return (pessoas * tempo * 270)/1000
}

const cargaIluminacao = function(lampadas,tempo,potencia){
    return (lampadas * tempo *potencia)/1000
}