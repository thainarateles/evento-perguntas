const lista = document.getElementById('lista-palestrante');
const limparBtn = document.getElementById('limpar');
const destaqueBox = document.getElementById('destaque-box');
const formId = document.getElementById('form-identificacao');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

formId.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo-palestra').value;
  const palestrante = document.getElementById('nome-palestrante').value;
  await fetch(scriptURL + `?titulo=${encodeURIComponent(titulo)}&palestrante=${encodeURIComponent(palestrante)}`);
});

async function carregarPerguntas() {
  try {
    const res = await fetch(scriptURL);
    const data = await res.json();

    lista.innerHTML = '';
    destaqueBox.innerHTML = '';

    data.perguntas.forEach((p, i) => {
      if (p.destaque === 'true') {
        destaqueBox.innerHTML = `
          <div class="alert alert-warning">
            <strong>${p.nome} pergunta:</strong> ${p.pergunta}
          </div>
        `;
      }

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start flex-column';
      li.innerHTML = `
        <div class="w-100 mb-2"><strong>${p.nome}:</strong> ${p.pergunta}</div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-warning" onclick="destacarPergunta(${i})">Destacar</button>
          <button class="btn btn-sm btn-outline-success" onclick="responderPergunta(${i})">Respondido</button>
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (e) {
    console.error('Erro ao carregar perguntas', e);
  }
}

async function destacarPergunta(index) {
  await fetch(scriptURL + '?destacar=' + index);
  carregarPerguntas();
}

async function responderPergunta(index) {
  await fetch(scriptURL + '?responder=' + index);
  carregarPerguntas();
}

limparBtn.addEventListener('click', async () => {
  if (confirm('Tem certeza que deseja apagar todas as perguntas?')) {
    await fetch(scriptURL + '?limpar=true');
    carregarPerguntas();
  }
});

setInterval(carregarPerguntas, 2000);
carregarPerguntas();

