const fs = require('fs');
const readline = require('readline');

// Caminho do arquivo JSON
const arquivo = 'dados.json';

// Verifica se o arquivo JSON existe, se não, cria um vazio
if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, '[]', 'utf8');
}

// Interface para entrada de dados no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para carregar registros do arquivo JSON
function carregarDados() {
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

// Função para salvar registros no arquivo JSON
function salvarDados(dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf8');
}

// Função para validar nome (somente letras e caracteres especiais permitidos)
function validarNome(nome) {
    return /^[a-zA-Zãáâêéíóôõúüç\s]+$/i.test(nome);
}

// Função para validar idade (somente números permitidos)
function validarIdade(idade) {
    return /^[0-9]+$/.test(idade);
}

// Função para solicitar nome válido
function perguntarNome(callback) {
    rl.question('Nome: ', (nome) => {
        if (!validarNome(nome)) {
            console.log('Nome inválido! Use apenas letras e caracteres especiais como ã, á, ç.');
            return perguntarNome(callback); // Repetir até que um nome válido seja digitado
        }
        callback(nome);
    });
}

// Função para solicitar idade válida
function perguntarIdade(callback) {
    rl.question('Idade: ', (idade) => {
        if (!validarIdade(idade)) {
            console.log('Idade inválida! Use apenas números.');
            return perguntarIdade(callback); // Repetir até que uma idade válida seja digitada
        }
        callback(parseInt(idade, 10));
    });
}

// Adicionar um novo registro
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

// Listar todos os registros
function listarRegistros() {
    const dados = carregarDados();
    if (dados.length === 0) {
        console.log('Nenhum registro encontrado.');
    } else {
        console.table(dados);
    }
    menu();
}

// Atualizar um registro existente
function atualizarRegistro() {
    rl.question('ID do registro para atualizar: ', (id) => {
        let dados = carregarDados();
        let index = dados.findIndex((item) => item.id === parseInt(id, 10));

        if (index === -1) {
            console.log('Registro não encontrado.');
            return menu();
        }

        perguntarIdade((idade) => {
            dados[index].idade = idade;
            salvarDados(dados);
            console.log('Registro atualizado com sucesso!');
            menu();
        });
    });
}

// Remover um registro existente
function removerRegistro() {
    rl.question('ID do registro para remover: ', (id) => {
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

// Menu de opções
function menu() {
    console.log('\n1 - Adicionar Registro');
    console.log('2 - Listar Registros');
    console.log('3 - Atualizar Registro');
    console.log('4 - Remover Registro');
    console.log('5 - Sair');
    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                adicionarRegistro();
                break;
            case '2':
                listarRegistros();
                break;
            case '3':
                atualizarRegistro();
                break;
            case '4':
                removerRegistro();
                break;
            case '5':
                rl.close();
                console.log('Saindo...');
                break;
            default:
                console.log('Opção inválida.');
                menu();
        }
    });
}

// Iniciar o programa
menu();