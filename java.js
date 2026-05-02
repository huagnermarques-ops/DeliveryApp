// ==========================
// VARIÁVEIS GLOBAIS
// ==========================
let userLocation = null;

// ==========================
// LOCALIZAÇÃO
// ==========================
function pegarLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      console.log("Localização:", userLocation);
      alert("Localização capturada!");
    },
    () => {
      alert("Permita a localização");
    }
  );
}

// ==========================
// CRIAR LOJA
// ==========================
function criarLoja() {
  const nome = document.getElementById("nomeLoja").value;
  const descricao = document.getElementById("descricao").value;
  const categoria = document.getElementById("categoria").value;

  if (!nome) {
    alert("Digite o nome da loja");
    return;
  }

  if (!userLocation) {
    alert("Clique em 'usar minha localização'");
    return;
  }

  const novaLoja = {
    id: Date.now(),
    nome,
    descricao,
    categoria,
    lat: userLocation.lat,
    lng: userLocation.lng,
    avaliacao: 0
  };

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];
  lojas.push(novaLoja);

  localStorage.setItem("lojas", JSON.stringify(lojas));

  alert("Loja criada com sucesso!");

  // limpar campos
  document.getElementById("nomeLoja").value = "";
  document.getElementById("descricao").value = "";
}

// ==========================
// LISTAR LOJAS
// ==========================
function carregarLojas() {
  const container = document.getElementById("listaLojas");
  if (!container) return;

  container.innerHTML = "";

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  if (lojas.length === 0) {
    container.innerHTML = "<p>Nenhuma loja encontrada</p>";
    return;
  }

  lojas.forEach(loja => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${loja.nome}</h3>
      <p>${loja.descricao || ""}</p>
      <small>${loja.categoria}</small>
      <hr>
    `;

    container.appendChild(div);
  });
}

// ==========================
// MAPA (Leaflet)
// ==========================
function carregarMapa() {
  if (!userLocation) return;

  const map = L.map('map').setView([userLocation.lat, userLocation.lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  lojas.forEach(loja => {
    L.marker([loja.lat, loja.lng])
      .addTo(map)
      .bindPopup(loja.nome);
  });
}

// ==========================
// AVALIAÇÕES
// ==========================
function carregarAvaliacoes() {
  const container = document.getElementById("avaliacoes");
  if (!container) return;

  container.innerHTML = "";

  let lojas = JSON.parse(localStorage.getItem("lojas")) || [];

  if (lojas.length === 0) {
    container.innerHTML = "<p>Nenhuma avaliação ainda</p>";
    return;
  }

  lojas.forEach(loja => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${loja.nome}</h3>
      <p>⭐ ${loja.avaliacao}</p>
      <hr>
    `;

    container.appendChild(div);
  });
}

