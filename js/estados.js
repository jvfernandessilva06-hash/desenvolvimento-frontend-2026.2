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

    case "sucesso": {
      const tarefasVisiveis = dados.tarefasVisiveis;
      const totalTarefas = dados.totalTarefas;

      quadro.hidden = false;

      renderizarTarefas(tarefasVisiveis, quadro);

      regiaoStatus.textContent = `${tarefasVisiveis.length} de ${totalTarefas} tarefas.`;
      break;
    }

    case "origem-vazia":
      quadro.hidden = true;
      regiaoStatus.textContent = "Nenhuma tarefa disponível.";
      break;

    case "resultado-vazio":
      quadro.hidden = false;

      renderizarTarefas([], quadro);

      regiaoStatus.textContent =
        "Nenhuma tarefa corresponde aos critérios. Altere ou limpe os filtros.";
      break;

    case "erro":
      quadro.hidden = true;
      regiaoStatus.textContent = dados;
      break;

    default:
      throw new Error(`Estado desconhecido: ${estado}`);
  }
}
