const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Banco em memória para agendamentos
let agendamentos = [];

// Rotas
app.get('/', (req, res) => {
  res.render('index', { title: 'Início' });
});

app.get('/agendar', (req, res) => {
  res.render('agendar', { title: 'Agendar Consultas' });
});

app.post('/agendar', (req, res) => {
  const { nome, advogado, data, hora, recorrente } = req.body;
  agendamentos.push({
    nome,
    advogado,
    data,
    hora,
    recorrente: recorrente === 'on'
  });
  res.redirect('/status');
});

app.get('/status', (req, res) => {
  res.render('status', { title: 'Status de Agendamento', agendamentos });
});

// Outras rotas (fila, new, etc) podem ser adicionadas aqui normalmente

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});