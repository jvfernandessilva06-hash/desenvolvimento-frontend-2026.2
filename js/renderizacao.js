function criarCartao(tarefa) {
  const cartao = document.createElement("article");
  cartao.className = "cartao";
  cartao.dataset.tarefaId = tarefa.id;

  const titulo = document.createElement("h4");
  titulo.textContent = tarefa.titulo;

  const prioridade = document.createElement("p");
  const textoPrioridade = document.createElement("strong");
  textoPrioridade.textContent = "Prioridade: ";
  prioridade.append(textoPrioridade, tarefa.prioridade);

  const prazo = document.createElement("p");
  const textoPrazo = document.createElement("strong");
  textoPrazo.textContent = "Prazo: ";

  const data = document.createElement("time");
  data.dateTime = tarefa.prazo;
  data.textContent = tarefa.prazo;

  prazo.append(textoPrazo, data);
  const botao = document.createElement("button");
  botao.type = "button";
  botao.dataset.acao = "ver-detalhes";

  const textoBotao = document.createElement("span");
  textoBotao.textContent = "Ver detalhes";

  botao.append(textoBotao);

  cartao.append(titulo, prioridade, prazo, botao);

  return cartao;
}

function renderizarTarefas(tarefas, quadro) {
  const listas = quadro.querySelectorAll("[data-lista-status]");

  listas.forEach((lista) => {
    const status = lista.dataset.listaStatus;

    const tarefasDoStatus = tarefas.filter(
      (tarefa) => tarefa.status === status,
    );

    const cartoes = tarefasDoStatus.map(criarCartao);

    lista.replaceChildren(...cartoes);
  });
}
function instalarEventosDoQuadro(quadro, tarefas) {
    quadro.addEventListener("click", (evento) => {
        if (!(evento.target instanceof Element)) {
            return;
        }

        const botao = evento.target.closest(
            'button[data-acao="ver-detalhes"]'
        );

        if (!botao || !quadro.contains(botao)) {
            return;
        }

        const cartao = botao.closest("[data-tarefa-id]");

        if (!cartao) {
            return;
        }

        const tarefa = tarefas.find(
            (item) => item.id === cartao.dataset.tarefaId
        );

        if (!tarefa) {
            return;
        }

        console.log("Detalhes da tarefa:", tarefa);
    });
}

export {
    criarCartao,
    renderizarTarefas,
    instalarEventosDoQuadro
};