const express = require('express');
const fs = require('fs');
const path = require('path');
const engine = require('ejs-mate'); // ADICIONADO

const app = express();
const PORT = 3000;

// Configuração do ejs-mate para usar layouts
app.engine('ejs', engine); // ADICIONADO
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Caminho para o arquivo de dados
const dataPath = path.join(__dirname, 'data', 'appointments.json');

// Página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Página de agendamento
app.get('/agendar', (req, res) => {
    res.render('agendar');
});

// Rota para salvar o agendamento
app.post('/agendar', (req, res) => {
    const { nome, advogado, data, hora, recorrente } = req.body;

    const novoAgendamento = {
        id: Date.now(),
        nome,
        advogado,
        data,
        hora,
        recorrente: recorrente === 'on'
    };

    let agendamentos = [];

    if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath);
        agendamentos = JSON.parse(raw);
    }

    agendamentos.push(novoAgendamento);
    fs.writeFileSync(dataPath, JSON.stringify(agendamentos, null, 2));

    res.redirect('/fila');
});

// Página da fila de atendimento
app.get('/fila', (req, res) => {
    let agendamentos = [];

    if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath);
        agendamentos = JSON.parse(raw);
    }

    agendamentos.sort((a, b) => {
        const dateA = new Date(`${a.data} ${a.hora}`);
        const dateB = new Date(`${b.data} ${b.hora}`);
        return dateA - dateB;
    });

    res.render('fila', { agendamentos });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
