const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");
const historicoLista = document.getElementById("historicoLista");
const limparHistoricoBtn = document.getElementById("limparHistoricoBtn");

const API_URL =
  "https://6a3d9cbfd8e212699e240877.mockapi.io/catalogo-animes/historico";

const searchAnime = async (query) => {
  const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=3`;

  const response = await fetch(url, {
    headers: { Accept: "application/vnd.api+json" },
  });

  const data = await response.json();
  return data.data;
};


const salvarPesquisa = async (anime) => {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anime: anime,
        data: new Date().toLocaleString("pt-BR"),
      }),
    });
  } catch (erro) {
    console.log(erro);
  }
};


const createAnimeCard = (anime) => {
  const attr = anime.attributes;

  const titulo = attr.canonicalTitle || "Sem título";
  const sinopse = attr.synopsis
    ? attr.synopsis.slice(0, 200) + "..."
    : "Sem sinopse.";
  const poster = attr.posterImage?.medium || "";
  const status = attr.status || "tba";
  const episodios = attr.episodeCount || "?";
  const inicio = attr.startDate || "?";
  const nota = attr.averageRating
    ? (attr.averageRating / 10).toFixed(1)
    : "?";

  const card = document.createElement("div");
  card.classList.add("task-item", "anime-card");

  card.innerHTML = `
    ${poster ? `<img src="${poster}" alt="${titulo}" class="anime-poster">` : ""}
    <div class="anime-info">
      <h3>${titulo}</h3>

      <p>${sinopse}</p>

      <div class="anime-detalhes">
        <span>📺 ${episodios} eps</span>
        <span>📅 ${inicio}</span>
        <span>⭐ ${nota}/10</span>
        <span>${traduzirStatus(status)}</span>
      </div>
    </div>
  `;

  tasksContainer.appendChild(card);
};

const traduzirStatus = (status) => {
  const mapa = {
    current: "Andamento",
    finished: "Finalizado",
    upcoming: "Anunciado",
    tba: "Não-Anunciado",
  };

  return mapa[status] || status;
};


const handleAddtask = async () => {
  const query = inputElement.value.trim();

  if (query.length === 0) {
    inputElement.classList.add("error");
    return;
  }

  inputElement.classList.remove("error");

  tasksContainer.innerHTML = "<p>Buscando...</p>";

  const animes = await searchAnime(query);

  tasksContainer.innerHTML = "";

  if (!animes || animes.length === 0) {
    tasksContainer.innerHTML = "<p>Nenhum anime encontrado.</p>";
    return;
  }

  await salvarEAtualizar(query);

  animes.forEach(createAnimeCard);
};

addTaskButton.addEventListener("click", handleAddtask);

inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddtask();
  }
});

const carregarHistorico = async () => {
  try {
    const response = await fetch(API_URL);
    const dados = await response.json();

    historicoLista.innerHTML = "";

    if (!dados || dados.length === 0) {
      historicoLista.innerHTML = '<li class="historico-vazio">Nenhuma pesquisa ainda.</li>';
      return;
    }

  
    dados.reverse().forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("historico-item");
      li.innerHTML = `
        <span>🔍 ${item.anime}</span>
        <span class="data">${item.data}</span>
        <button class="deletar-btn" title="Remover" data-id="${item.id}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
      historicoLista.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
  }
};

const deletarPesquisa = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarHistorico();
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
  }
};

historicoLista.addEventListener("click", (e) => {
  const btn = e.target.closest(".deletar-btn");
  if (btn) {
    deletarPesquisa(btn.dataset.id);
  }
});

limparHistoricoBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(API_URL);
    const dados = await response.json();
    await Promise.all(dados.map((item) => fetch(`${API_URL}/${item.id}`, { method: "DELETE" })));
    carregarHistorico();
  } catch (erro) {
    console.error("Erro ao limpar histórico:", erro);
  }
});


const originalSalvar = salvarPesquisa;
const salvarEAtualizar = async (anime) => {
  await originalSalvar(anime);
  carregarHistorico();
};


carregarHistorico();
