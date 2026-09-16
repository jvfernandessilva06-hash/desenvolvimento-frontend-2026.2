import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { instalarEventosDoQuadro } from "./renderizacao.js";

const quadro = document.querySelector("[data-quadro]");

if (!quadro) {
    throw new Error("Contêiner [data-quadro] não encontrado.");
}

async function iniciarAplicacao() {
    renderizarEstado("carregando");

    try {
        const tarefas = await carregarTarefas();

        if (tarefas.length === 0) {
            renderizarEstado("vazio");
            return;
        }

        renderizarEstado("sucesso", tarefas);
        instalarEventosDoQuadro(quadro, tarefas);
    } catch (erro) {
        let mensagem;

        if (erro.name === "TypeError") {
            mensagem = "Erro de rede: não foi possível carregar as tarefas.";
        } else if (erro.name === "SyntaxError") {
            mensagem = "Erro de formato: os dados recebidos são inválidos.";
        } else {
            mensagem = `Erro ao carregar tarefas: ${erro.message}`;
        }

        renderizarEstado("erro", mensagem);
    }
}

iniciarAplicacao();