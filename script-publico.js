const form = document.getElementById('form-pergunta');
const lista = document.getElementById('lista-perguntas');
const destaqueArea = document.getElementById('pergunta-destacada');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim() || 'Anônimo';
  const pergunta = document.getElementById('pergunta').value;

  // Mostra imediatamente na tela
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerHTML = `<strong>${nome}:</strong> ${pergunta}`;
  lista.appendChild(li);

  // Envia para o Google Sheets
  fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({ nome, pergunta })
  });

  document.getElementById('nome').value = '';
  document.getElementById('pergunta').value = '';
});

async function carregarPerguntas() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  // Limpa e mostra pergunta destacada
  destaqueArea.innerHTML = '';
  const perguntaDestacada = data.perguntas.find(p => p.destaque === 'true');
  if (perguntaDestacada) {
    destaqueArea.innerHTML = `
      <div class="alert alert-info">
        <strong>Respondendo agora:</strong> ${perguntaDestacada.nome}: ${perguntaDestacada.pergunta}
      </div>
    `;
  }

  // Lista todas as perguntas
  lista.innerHTML = '';
  data.perguntas.forEach(p => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<strong>${p.nome}:</strong> ${p.pergunta}`;
    lista.appendChild(li);
  });
}

setInterval(carregarPerguntas, 2000);
carregarPerguntas();

