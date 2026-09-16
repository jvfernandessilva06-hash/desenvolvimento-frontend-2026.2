import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { instalarEventosDoQuadro } from "./renderizacao.js";
const estado = {
  tarefas: [],
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "padrao",
  carregamento: true,
  erro: null,
};
function derivarTarefas(estado) {
  let tarefasVisiveis = [...estado.tarefas];

  if (estado.busca) {
    const buscaNormalizada = estado.busca.toLowerCase();

    tarefasVisiveis = tarefasVisiveis.filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(buscaNormalizada),
    );
  }

  if (estado.status !== "todos") {
    tarefasVisiveis = tarefasVisiveis.filter(
      (tarefa) => tarefa.status === estado.status,
    );
  }

  if (estado.prioridade !== "todas") {
    tarefasVisiveis = tarefasVisiveis.filter(
      (tarefa) => tarefa.prioridade === estado.prioridade,
    );
  }

  if (estado.ordenacao === "prazo") {
    tarefasVisiveis.sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
  }

  return tarefasVisiveis;
}

function renderizarAplicacao() {
  if (estado.carregamento) {
    renderizarEstado("carregando");
    return;
  }

  if (estado.erro) {
    renderizarEstado("erro", estado.erro);
    return;
  }

  if (estado.tarefas.length === 0) {
    renderizarEstado("vazio");
    return;
  }

  const tarefasVisiveis = derivarTarefas(estado);

  renderizarEstado("sucesso", tarefasVisiveis);
}

const quadro = document.querySelector("[data-quadro]");

if (!quadro) {
  throw new Error("Contêiner [data-quadro] não encontrado.");
}

async function iniciarAplicacao() {
  renderizarAplicacao();

  try {
    const tarefas = await carregarTarefas();

    estado.tarefas = tarefas;
    estado.carregamento = false;
    estado.erro = null;

    renderizarAplicacao();

    instalarEventosDoQuadro(quadro, estado.tarefas);
  } catch (erro) {
    estado.carregamento = false;

    if (erro.name === "TypeError") {
      estado.erro = "Erro de rede: não foi possível carregar as tarefas.";
    } else if (erro.name === "SyntaxError") {
      estado.erro = "Erro de formato: os dados recebidos são inválidos.";
    } else {
      estado.erro = `Erro ao carregar tarefas: ${erro.message}`;
    }

    renderizarAplicacao();
  }
}

iniciarAplicacao();
