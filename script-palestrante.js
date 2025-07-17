const lista = document.getElementById('lista-palestrante');
const limparBtn = document.getElementById('limpar');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

let ultimoEstado = null; // agora usamos null para garantir atualização inicial

async function carregarPerguntas() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  const novoEstado = JSON.stringify(data.perguntas);
  if (novoEstado !== ultimoEstado || ultimoEstado === null) {
    ultimoEstado = novoEstado;
    lista.innerHTML = '';

    data.perguntas.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const destaqueClass = p.destaque === 'true' ? 'fw-bold text-primary' : '';

      li.innerHTML = `
        <span class="${destaqueClass}">
          <strong>${p.nome}:</strong> ${p.pergunta}
        </span>
        <button class="btn btn-outline-warning btn-sm" onclick="destacarPergunta(${i})">Destacar</button>
      `;
      lista.appendChild(li);
    });
  }
}

async function destacarPergunta(index) {
  await fetch(scriptURL + '?destacar=' + index);
  await carregarPerguntas();
}

limparBtn.addEventListener('click', async () => {
  if (confirm('Tem certeza que deseja apagar todas as perguntas?')) {
    await fetch(scriptURL + '?limpar=true');
    await carregarPerguntas();
  }
});

setInterval(carregarPerguntas, 1000);
carregarPerguntas(); // força carregamento na abertura da página