const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'segredo-jurídico',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// View engine e layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Variáveis globais para todas as views
app.use((req, res, next) => {
  res.locals.title = 'Escritório Jurídico';
  res.locals.mensagem = req.flash('sucesso') || [];
  next();
});

// Banco em memória
let posts = [
  {
    id: 1,
    titulo: 'Introdução ao EJS',
    autor: 'João Silva',
    data: '12/05/2025',
    conteudo: 'EJS é uma linguagem de template que permite incluir JavaScript em HTML de forma simples.'
  }
];

let agendamentos = [];

// Rotas
app.get('/', (req, res) => {
  res.render('index', { posts, title: 'Início' });
});

app.get('/novo', (req, res) => {
  res.render('new', { title: 'Novo Post' });
});

app.post('/post', (req, res) => {
  const { titulo, autor, conteudo } = req.body;
  const novoPost = {
    id: posts.length + 1,
    titulo,
    autor,
    data: new Date().toLocaleDateString('pt-BR'),
    conteudo
  };
  posts.unshift(novoPost);
  req.flash('sucesso', '✅ Post criado com sucesso!');
  res.redirect('/');
});

app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('Post não encontrado');
  res.render('post', { post, title: post.titulo });
});

app.get('/agendar', (req, res) => {
  res.render('agendar', { title: 'Agendar Consulta' });
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
  req.flash('sucesso', '✅ Consulta agendada com sucesso!');
  res.redirect('/');
});

app.get('/fila', (req, res) => {
  res.render('fila', { agendamentos, title: 'Fila de Atendimento' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
