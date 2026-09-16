import { tarefas } from "./dados.js";
import {
    renderizarTarefas,
    instalarEventosDoQuadro
} from "./renderizacao.js";

const quadro = document.querySelector("[data-quadro]");

if (!quadro) {
    throw new Error("Contêiner [data-quadro] não encontrado.");
}

renderizarTarefas(tarefas, quadro);
instalarEventosDoQuadro(quadro, tarefas);