const form = document.getElementById('form-pergunta');
const lista = document.getElementById('lista-perguntas');
const destaqueDiv = document.getElementById('pergunta-destacada');
const tituloPalestra = document.getElementById('titulo-palestra');
const nomePalestrante = document.getElementById('nome-palestrante');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim() || 'Anônimo';
  const pergunta = document.getElementById('pergunta').value.trim();
  if (!pergunta) return;

  await fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({ nome, pergunta })
  });

  document.getElementById('nome').value = '';
  document.getElementById('pergunta').value = '';
  carregarPerguntas();
});

async function carregarPerguntas() {
  try {
    const res = await fetch(scriptURL);
    const data = await res.json();

    // Cabeçalho da palestra
    tituloPalestra.textContent = data.titulo || 'Título da Palestra';
    nomePalestrante.textContent = data.palestrante || 'Palestrante';

    lista.innerHTML = '';
    destaqueDiv.innerHTML = '';

    data.perguntas.forEach(p => {
      if (p.respondido === 'true') return;

      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<strong>${p.nome}:</strong> ${p.pergunta}`;

      if (p.destaque === 'true') {
        destaqueDiv.innerHTML = `
          <div class="alert alert-warning">
            <strong>${p.nome} pergunta:</strong> ${p.pergunta}
          </div>
        `;
      } else {
        lista.appendChild(li);
      }
    });
  } catch (e) {
    console.error('Erro ao carregar perguntas', e);
  }
}

setInterval(carregarPerguntas, 2000);
carregarPerguntas();

