const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

const searchAnime = async (query) => {
  const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=3`;
  
  const response = await fetch(url, {
    headers: { "Accept": "application/vnd.api+json" }
  });
  const data = await response.json();
  return data.data;
};

const createAnimeCard = (anime) => {
  const attr = anime.attributes;

  const titulo    = attr.canonicalTitle || "Sem título";
  const sinopse   = attr.synopsis ? attr.synopsis.slice(0, 200) + "..." : "Sem sinopse.";
  const poster    = attr.posterImage?.medium || "";
  const status    = attr.status || "tba";
  const episodios = attr.episodeCount || "?";
  const inicio    = attr.startDate || "?";
  const nota      = attr.averageRating ? (attr.averageRating / 10).toFixed(1) : "?";

  const card = document.createElement("div");
  card.classList.add("task-item", "anime-card");

  card.innerHTML = `
    ${poster ? `<img src="${poster}" alt="${titulo}" class="anime-poster" />` : ""}
    <div class="anime-info">
      <h3 class="anime-title">${titulo}</h3>
      <p class="anime-sinopse">${sinopse}</p>
      <div class="anime-detalhes">
        <span><i class="fas fa-tv"></i> ${episodios} eps</span>
        <span><i class="fas fa-calendar"></i> ${inicio}</span>
        <span><i class="fas fa-star"></i> ${nota}/10</span>
        <span class="status-badge status-${status}">${traduzirStatus(status)}</span>
      </div>
    </div>
  `;
  tasksContainer.appendChild(card);
}

const traduzirStatus = (status) => {
  const mapa = {
    current: "Andamento",
    finished: "Finalizado",
    upcoming: "Anunciado",
    tba: "Não-Anunciado"
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
  tasksContainer.innerHTML = "<p class=`loading`>Buscando...</p>";

  const animes = await searchAnime(query);
  tasksContainer.innerHTML = "";

  if (!animes || animes.length === 0) {
    tasksContainer.innerHTML = "<p class='loading'>Nenhum anime encontrado.</p>";
    return;
  }

  animes.forEach(createAnimeCard);
};

addTaskButton.addEventListener("click", handleAddtask);

inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleAddtask();
});
