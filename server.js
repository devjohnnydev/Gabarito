const express = require('express');
const { simular, validar } = require('./calculos');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/simular', (req, res) => {
  const aparelhos = req.body && req.body.aparelhos;
  const erro = validar(aparelhos);
  if (erro) return res.status(400).json({ erro });
  res.json(simular(aparelhos));
});

// JSON malformado também vira 400 com mensagem legível
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  next(err);
});

if (require.main === module) {
  app.listen(3000, () => console.log('Medidor Coopera em http://localhost:3000'));
}

module.exports = app;
