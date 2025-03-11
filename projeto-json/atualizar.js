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

function validarNome(nome) {
    return /^[a-zA-Zãáâêéíóôõúüç\s]+$/i.test(nome) && nome.trim().length > 0;
}

function validarIdade(idade) {
    return /^[0-9]+$/.test(idade);
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

function atualizarRegistro() {
    if (!listarRegistros()) {
        menu();
        return;
    }

    rl.question('Digite o ID do registro que deseja atualizar: ', (id) => {
        let dados = carregarDados();
        let index = dados.findIndex((item) => item.id === parseInt(id, 10));

        if (index === -1) {
            console.log('Registro não encontrado.');
            menu();
            return;
        }

        console.log(`Registro encontrado: ID: ${dados[index].id}, Nome: ${dados[index].nome}, Idade: ${dados[index].idade}`);

        rl.question('Novo Nome (ou pressione Enter para manter o mesmo): ', (novoNome) => {
            if (novoNome.trim().length > 0 && validarNome(novoNome)) {
                dados[index].nome = novoNome;
            }

            rl.question('Nova Idade (ou pressione Enter para manter a mesma): ', (novaIdade) => {
                if (novaIdade.trim().length > 0 && validarIdade(novaIdade)) {
                    dados[index].idade = parseInt(novaIdade, 10);
                }

                salvarDados(dados);
                console.log('Registro atualizado com sucesso!');
                menu();
            });
        });
    });
}

function menu() {
    rl.question(
        'Escolha uma opção:\n1 - Atualizar\n2 - Sair\nEscolha: ',
        (opcao) => {
            if (opcao === '1') {
                atualizarRegistro();
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