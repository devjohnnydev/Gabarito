// Rode com: npm test   (usa os parâmetros do caso oficial em config.js)
const test = require('node:test');
const assert = require('node:assert');
const { simular, validar } = require('./calculos');

const casoOficial = [
  { nome: 'Geladeira', potenciaW: 150, horasDia: 24, diasMes: 30 },
  { nome: 'Chuveiro', potenciaW: 5500, horasDia: 0.5, diasMes: 30 },
  { nome: 'TV', potenciaW: 100, horasDia: 5, diasMes: 30 },
];

test('caso de teste oficial', () => {
  const r = simular(casoOficial);
  assert.strictEqual(r.consumoKwhMes, 205.5);
  assert.strictEqual(r.custoEnergia, 164.4);
  assert.strictEqual(r.adicionalBandeira, 3.87);
  assert.strictEqual(r.totalMes, 168.27);
  assert.strictEqual(r.paineisNecessarios, 5);
  assert.deepStrictEqual(r.aparelhoMaisCaro, { nome: 'Geladeira', custo: 86.4 });
});

test('exemplo do contrato da API (só geladeira)', () => {
  const r = simular([casoOficial[0]]);
  assert.strictEqual(r.totalMes, 88.44);
  assert.strictEqual(r.adicionalBandeira, 2.04);
  assert.strictEqual(r.paineisNecessarios, 3);
});

test('validação', () => {
  assert.ok(validar([]));
  assert.ok(validar([{ nome: 'X', potenciaW: 100, horasDia: 25, diasMes: 30 }]).includes('horasDia'));
  assert.ok(validar([{ nome: 'X', potenciaW: '100', horasDia: 2, diasMes: 30 }]).includes('potenciaW'));
  assert.ok(validar([{ nome: ' ', potenciaW: 100, horasDia: 2, diasMes: 30 }]).includes('nome'));
  assert.strictEqual(validar(casoOficial), null);
});
