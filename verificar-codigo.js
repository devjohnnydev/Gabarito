// Uso:
//   node verificar-codigo.js "Nome Completo" 12        -> mostra o código esperado do aluno nº 12
//   node verificar-codigo.js --params 12               -> mostra os parâmetros pessoais do aluno nº 12
//   node verificar-codigo.js --tabela 40               -> tabela de parâmetros e respostas dos autotestes, alunos 1 a 40

const BANDEIRAS = ['verde', 'amarela', 'vermelha1', 'vermelha2'];
const VALOR = { verde: 0, amarela: 1.885, vermelha1: 4.463, vermelha2: 7.877 };
const r2 = (v) => Math.round(v * 100) / 100;

function parametros(n) {
  return {
    tarifa: Math.round((0.68 + (n % 7) * 0.035) * 1000) / 1000,
    bandeira: BANDEIRAS[n % 4],
    hsp: Math.round((4.0 + (n % 5) * 0.25) * 100) / 100,
    painel: 400 + (n % 3) * 50,
  };
}

function respostas(p) {
  return {
    a3: r2(250 * p.tarifa),
    a4: Math.ceil(300 / ((p.painel / 1000) * p.hsp * 30 * 0.8)),
    b4: r2(108 * p.tarifa + 1.08 * VALOR[p.bandeira]),
  };
}

function codigo(nome, n) {
  const s = nome.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toUpperCase().replace(/\s+/g, ' ');
  let h = n * 131;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 99991;
  return 'MC-' + String(n).padStart(2, '0') + '-' + h.toString(36).toUpperCase().padStart(4, '0');
}

const [a, b] = process.argv.slice(2);
if (a === '--params') {
  const n = Number(b);
  console.log({ numero: n, ...parametros(n), respostasAutoteste: respostas(parametros(n)) });
} else if (a === '--tabela') {
  const total = Number(b) || 40;
  const linhas = [];
  for (let n = 1; n <= total; n++) {
    const p = parametros(n);
    linhas.push({ n, ...p, ...respostas(p) });
  }
  console.table(linhas);
} else if (a && b) {
  console.log(codigo(a, Number(b)));
} else {
  console.log('Uso: node verificar-codigo.js "Nome Completo" <numero> | --params <numero> | --tabela <qtd>');
}

module.exports = { parametros, respostas, codigo };
