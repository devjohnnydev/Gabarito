const aparelhos = [];
const form = document.querySelector('#form-aparelho');
const lista = document.querySelector('#lista-aparelhos');
const saida = document.querySelector('#resultado');
const erroEl = document.querySelector('#erro');

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const n2 = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function desenharLista() {
  lista.replaceChildren();
  aparelhos.forEach((a, indice) => {
    const li = document.createElement('li');
    const texto = document.createElement('span');
    texto.textContent = `${a.nome} · ${a.potenciaW} W · ${a.horasDia} h/dia · ${a.diasMes} dias`;

    const remover = document.createElement('button');
    remover.type = 'button';
    remover.textContent = 'Remover';
    remover.addEventListener('click', () => {
      aparelhos.splice(indice, 1);
      desenharLista();
    });

    li.append(texto, remover);
    lista.append(li);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  aparelhos.push({
    nome: document.querySelector('#nome').value.trim(),
    potenciaW: Number(document.querySelector('#potencia').value),
    horasDia: Number(document.querySelector('#horas').value),
    diasMes: Number(document.querySelector('#dias').value),
  });
  form.reset();
  document.querySelector('#dias').value = 30;
  desenharLista();
});

function celula(tag, texto) {
  const el = document.createElement(tag);
  el.textContent = texto;
  return el;
}

function desenharResultado(r) {
  saida.replaceChildren();

  const destaque = document.createElement('div');
  destaque.className = 'destaque';
  destaque.append(
    celula('p', `Consumo: ${n2(r.consumoKwhMes)} kWh/mês`),
    celula('p', `Conta estimada: ${brl(r.totalMes)} (energia ${brl(r.custoEnergia)} + bandeira ${brl(r.adicionalBandeira)})`),
    celula('p', `Painéis solares necessários: ${r.paineisNecessarios}`),
    celula('strong', `Aparelho mais caro: ${r.aparelhoMaisCaro.nome} (${brl(r.aparelhoMaisCaro.custo)})`)
  );

  const tabela = document.createElement('table');
  const cab = document.createElement('tr');
  ['Aparelho', 'kWh/mês', 'Custo', '%'].forEach((t) => cab.append(celula('th', t)));
  tabela.append(cab);
  r.detalhes.forEach((d) => {
    const tr = document.createElement('tr');
    tr.append(celula('td', d.nome), celula('td', n2(d.kwhMes)), celula('td', brl(d.custo)), celula('td', `${n2(d.percentual)}%`));
    tabela.append(tr);
  });

  saida.append(destaque, tabela);
}

document.querySelector('#btn-simular').addEventListener('click', async () => {
  erroEl.hidden = true;
  try {
    const resposta = await fetch('/api/simular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aparelhos }),
    });
    const dados = await resposta.json();
    if (!resposta.ok) {
      erroEl.textContent = dados.erro;
      erroEl.hidden = false;
      return;
    }
    desenharResultado(dados);
  } catch (e) {
    erroEl.textContent = 'Não foi possível falar com o servidor. Ele está rodando?';
    erroEl.hidden = false;
  }
});
