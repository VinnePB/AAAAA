const fs = require('fs');
const readline = require('readline');

const arquivo = 'dados.json';

// Verifica se o arquivo JSON existe
if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, '[]', 'utf8');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function carregarDados() {
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function salvarDados(dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf8');
}

function validarNome(nome) {
    return /^[a-zA-Zãáâêéíóôõúüç\s]+$/i.test(nome) && nome.trim().length > 0;
}

function validarIdade(idade) {
    return /^[0-9]+$/.test(idade);
}

function perguntarNome(callback) {
    rl.question('Nome: ', (nome) => {
        if (!validarNome(nome)) {
            console.log('Nome inválido! Não pode ser vazio e deve conter apenas letras e caracteres especiais.');
            return perguntarNome(callback);
        }
        callback(nome);
    });
}

function perguntarIdade(callback) {
    rl.question('Idade: ', (idade) => {
        if (!validarIdade(idade)) {
            console.log('Idade inválida! Use apenas números.');
            return perguntarIdade(callback);
        }
        callback(parseInt(idade, 10));
    });
}

function adicionarRegistro() {
    perguntarNome((nome) => {
        perguntarIdade((idade) => {
            let dados = carregarDados();
            const novoRegistro = {
                id: dados.length > 0 ? dados[dados.length - 1].id + 1 : 1,
                nome,
                idade
            };
            dados.push(novoRegistro);
            salvarDados(dados);
            console.log('Registro adicionado com sucesso!');
            menu();
        });
    });
}

function menu() {
    rl.question(
        'Escolha uma opção:\n1 - Adicionar\n2 - Sair\nEscolha: ',
        (opcao) => {
            if (opcao === '1') {
                adicionarRegistro();
            } else if (opcao === '2') {
                rl.close();
            } else {
                console.log('Opção inválida!');
                menu();
            }
        }
    );
}

menu();