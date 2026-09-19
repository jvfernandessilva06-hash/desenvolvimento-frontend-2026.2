import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { instalarEventosDoQuadro } from "./renderizacao.js";

// Estado único da aplicação
const estado = {
  tarefas: [],
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "padrao",
  carregamento: true,
  erro: null,
};

// Elementos da interface
const quadro = document.querySelector("[data-quadro]");
const campoBusca = document.querySelector("#busca");
const filtrosStatus = document.querySelectorAll('input[name="status"]');
const filtrosPrioridade = document.querySelectorAll('input[name="prioridade"]');
const campoOrdenacao = document.querySelector("#ordenacao");
const botaoLimpar = document.querySelector("#limpar-filtros");

if (!quadro || !campoBusca || !campoOrdenacao || !botaoLimpar) {
  throw new Error("Elementos da interface não encontrados.");
}

// Deriva a lista visível sem alterar estado.tarefas
function derivarTarefas(estado) {
  let tarefasVisiveis = [...estado.tarefas];

  // Busca por título
  if (estado.busca) {
    const buscaNormalizada = estado.busca.trim().toLowerCase();

    tarefasVisiveis = tarefasVisiveis.filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(buscaNormalizada),
    );
  }

  // Filtro por status
  if (estado.status !== "todos") {
    tarefasVisiveis = tarefasVisiveis.filter(
      (tarefa) => tarefa.status === estado.status,
    );
  }

  // Filtro por prioridade
  if (estado.prioridade !== "todas") {
    tarefasVisiveis = tarefasVisiveis.filter(
      (tarefa) => tarefa.prioridade === estado.prioridade,
    );
  }

  // Ordenação por prazo
  if (estado.ordenacao === "prazo") {
    tarefasVisiveis.sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
  }

  return tarefasVisiveis;
}

// Ponto único de renderização
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
    renderizarEstado("origem-vazia");
    return;
  }

  const tarefasVisiveis = derivarTarefas(estado);

  if (tarefasVisiveis.length === 0) {
    renderizarEstado("resultado-vazio");
    return;
  }

  renderizarEstado("sucesso", {
    tarefasVisiveis,
    totalTarefas: estado.tarefas.length,
  });
}

const tarefasVisiveis = derivarTarefas(estado);

// Por enquanto, o estados.js ainda trata o sucess

// Busca
campoBusca.addEventListener("input", (evento) => {
  estado.busca = evento.target.value;
  renderizarAplicacao();
});

// Status
filtrosStatus.forEach((filtro) => {
  filtro.addEventListener("change", (evento) => {
    estado.status = evento.target.value;
    renderizarAplicacao();
  });
});

// Prioridade
filtrosPrioridade.forEach((filtro) => {
  filtro.addEventListener("change", (evento) => {
    estado.prioridade = evento.target.value;
    renderizarAplicacao();
  });
});

// Ordenação
campoOrdenacao.addEventListener("change", (evento) => {
  estado.ordenacao = evento.target.value;
  renderizarAplicacao();
});

// Limpar filtros
botaoLimpar.addEventListener("click", () => {
  estado.busca = "";
  estado.status = "todos";
  estado.prioridade = "todas";
  estado.ordenacao = "padrao";

  campoBusca.value = "";

  const statusTodos = document.querySelector(
    'input[name="status"][value="todos"]',
  );

  const prioridadeTodas = document.querySelector(
    'input[name="prioridade"][value="todas"]',
  );

  if (statusTodos) {
    statusTodos.checked = true;
  }

  if (prioridadeTodas) {
    prioridadeTodas.checked = true;
  }

  campoOrdenacao.value = "padrao";

  renderizarAplicacao();
});

// Inicialização da aplicação
async function iniciarAplicacao() {
  renderizarAplicacao();

  try {
    const tarefas = await carregarTarefas();

    estado.tarefas = tarefas;
    estado.carregamento = false;
    estado.erro = null;

    renderizarAplicacao();

    // Instala uma única vez
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
