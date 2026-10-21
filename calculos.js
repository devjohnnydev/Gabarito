const cfg = require('./config');

const DIAS_REFERENCIA = 30;
const arred = (v) => Math.round(v * 100) / 100;

function consumoMensalKwh(aparelho) {
  return (aparelho.potenciaW * aparelho.horasDia * aparelho.diasMes) / 1000;
}

function custoEnergia(kwh) {
  return kwh * cfg.TARIFA_KWH;
}

function adicionalBandeira(kwh) {
  return (kwh / 100) * cfg.VALORES_BANDEIRA[cfg.BANDEIRA];
}

function geracaoPorPainelKwh() {
  return (cfg.POTENCIA_PAINEL_W / 1000) * cfg.HSP * DIAS_REFERENCIA * cfg.EFICIENCIA;
}

function paineisNecessarios(kwh) {
  return Math.ceil(kwh / geracaoPorPainelKwh());
}

function simular(aparelhos) {
  const itens = aparelhos.map((a) => {
    const kwh = consumoMensalKwh(a);
    return { nome: a.nome.trim(), kwh, custo: custoEnergia(kwh) };
  });

  const total = itens.reduce((soma, i) => soma + i.kwh, 0);
  const energia = custoEnergia(total);
  const bandeira = adicionalBandeira(total);
  const maisCaro = itens.reduce((max, i) => (i.custo > max.custo ? i : max), itens[0]);

  return {
    consumoKwhMes: arred(total),
    custoEnergia: arred(energia),
    adicionalBandeira: arred(bandeira),
    totalMes: arred(energia + bandeira),
    paineisNecessarios: total > 0 ? paineisNecessarios(total) : 0,
    aparelhoMaisCaro: { nome: maisCaro.nome, custo: arred(maisCaro.custo) },
    detalhes: itens.map((i) => ({
      nome: i.nome,
      kwhMes: arred(i.kwh),
      custo: arred(i.custo),
      percentual: total > 0 ? arred((i.kwh / total) * 100) : 0,
    })),
  };
}

function validar(aparelhos) {
  if (!Array.isArray(aparelhos) || aparelhos.length === 0) {
    return 'Envie ao menos um aparelho na lista "aparelhos"';
  }
  const ehNumero = (v) => typeof v === 'number' && Number.isFinite(v);
  for (let i = 0; i < aparelhos.length; i++) {
    const a = aparelhos[i] || {};
    const pos = `(aparelho ${i + 1})`;
    if (typeof a.nome !== 'string' || a.nome.trim() === '') return `nome é obrigatório ${pos}`;
    if (!ehNumero(a.potenciaW) || a.potenciaW < 1 || a.potenciaW > 10000) return `potenciaW deve estar entre 1 e 10000 ${pos}`;
    if (!ehNumero(a.horasDia) || a.horasDia < 0 || a.horasDia > 24) return `horasDia deve estar entre 0 e 24 ${pos}`;
    if (!Number.isInteger(a.diasMes) || a.diasMes < 1 || a.diasMes > 31) return `diasMes deve ser inteiro entre 1 e 31 ${pos}`;
  }
  return null;
}

module.exports = { consumoMensalKwh, custoEnergia, adicionalBandeira, paineisNecessarios, simular, validar };
