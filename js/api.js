export async function carregarTarefas() {
    const resposta = await fetch("./dados.json");

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados.tarefas)) {
        throw new SyntaxError("Formato inválido: tarefas deve ser um array.");
    }

    return dados.tarefas;
}