const fs = require('fs');
const readline = require('readline');

const arquivo = 'dados.json';

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

function listarRegistros() {
    const dados = carregarDados();
    if (dados.length === 0) {
        console.log('Nenhum registro encontrado.');
        return false;
    }
    console.table(dados.map(({ id, nome }) => ({ ID: id, Nome: nome })));
    return true;
}

function removerRegistro() {
    if (!listarRegistros()) {
        menu();
        return;
    }

    rl.question('Digite o ID do registro que deseja remover: ', (id) => {
        let dados = carregarDados();
        let novoArray = dados.filter((item) => item.id !== parseInt(id, 10));

        if (dados.length === novoArray.length) {
            console.log('Registro não encontrado.');
        } else {
            salvarDados(novoArray);
            console.log('Registro removido com sucesso!');
        }
        menu();
    });
}

function menu() {
    rl.question(
        'Escolha uma opção:\n1 - Remover\n2 - Sair\nEscolha: ',
        (opcao) => {
            if (opcao === '1') {
                removerRegistro();
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