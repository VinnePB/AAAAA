const fs = require('fs');
const readline = require('readline');

const arquivo = 'dados.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function carregarDados() {
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function listarRegistros() {
    const dados = carregarDados();
    if (dados.length === 0) {
        console.log('Nenhum registro encontrado.');
    } else {
        console.table(dados);
    }
    menu();
}

function menu() {
    rl.question(
        'Escolha uma opção:\n1 - Listar\n2 - Sair\nEscolha: ',
        (opcao) => {
            if (opcao === '1') {
                listarRegistros();
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