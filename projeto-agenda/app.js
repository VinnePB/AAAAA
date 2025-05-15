const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Load lawyers data
const lawyers = JSON.parse(fs.readFileSync('./data/lawyers.json'));

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
  res.render('agendar', { 
    title: 'Agendar Consultas', 
    lawyers, 
    agendamentos,
    errors: {} // <-- Adicione esta linha
  });
});

app.post('/agendar', (req, res) => {
  const { nome, cpf, telefone, advogado, data, hora, recorrente } = req.body;
  let errors = {};

  // Validação de campos obrigatórios
  if (!nome) errors.nome = true;
  if (!cpf) errors.cpf = true;
  if (!telefone) errors.telefone = true;
  if (!advogado) errors.advogado = true;
  if (!data) errors.data = true;
  if (!hora) errors.hora = true;

  // Validação de formato de telefone
  const telefoneRegex = /^\+55\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
  if (telefone && !telefoneRegex.test(telefone)) {
    errors.telefone = true;
  }

  // Se houver campos obrigatórios não preenchidos
  if (Object.keys(errors).length > 0) {
    return res.render('agendar', {
      title: 'Agendar Consultas',
      error: 'Preencha todos os campos obrigatórios.',
      lawyers,
      agendamentos,
      nome,
      cpf,
      telefone,
      advogado,
      data,
      hora,
      errors
    });
  }

  // Validação de horário
  const [h, m] = hora.split(':').map(Number);
  const isManha = h >= 8 && h < 11;
  const isTarde = h >= 13 && h < 18;
  if (!(isManha || isTarde)) {
    return res.render('agendar', { 
      title: 'Agendar Consultas', 
      error: 'Horário inválido! Escolha entre 08:00-11:00 ou 13:00-18:00.',
      lawyers,
      agendamentos,
      nome,
      cpf,
      telefone,
      advogado,
      data,
      hora,
      errors
    });
  }

  // Verifica se o advogado já tem agendamento nesse dia/hora
  const indisponivel = agendamentos.some(a => 
    a.advogado == advogado && a.data === data && a.hora === hora
  );
  if (indisponivel) {
    return res.render('agendar', { 
      title: 'Agendar Consultas', 
      error: 'Este advogado já possui um agendamento neste dia e horário.',
      lawyers,
      agendamentos,
      nome,
      cpf,
      telefone,
      advogado,
      data,
      hora,
      errors
    });
  }

  agendamentos.push({
    nome,
    cpf,
    telefone,
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