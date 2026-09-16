import { renderizarTarefas } from "./renderizacao.js";

const regiaoStatus = document.querySelector("[data-status-aplicacao]");

const quadro = document.querySelector("[data-quadro]");

if (!regiaoStatus || !quadro) {
  throw new Error("Elementos da interface não encontrados.");
}

export function renderizarEstado(estado, dados) {
  switch (estado) {
    case "carregando":
      quadro.hidden = true;
      regiaoStatus.textContent = "Carregando tarefas...";
      break;

    case "sucesso":
      quadro.hidden = false;
      renderizarTarefas(dados, quadro);
      regiaoStatus.textContent = `${dados.length} tarefas carregadas.`;
      break;

    case "vazio":
      quadro.hidden = true;
      regiaoStatus.textContent = "Nenhuma tarefa encontrada.";
      break;

    case "erro":
      quadro.hidden = true;
      regiaoStatus.textContent = dados;
      break;

    default:
      throw new Error(`Estado desconhecido: ${estado}`);
  }
}
