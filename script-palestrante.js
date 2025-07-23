const lista = document.getElementById('lista-palestrante');
const limparBtn = document.getElementById('limpar');
const destaqueArea = document.getElementById('pergunta-destacada');
const blocoDestaque = document.getElementById('bloco-destaque'); // novo
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

let ultimoEstado = null;

async function carregarPerguntas() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  lista.innerHTML = '';
  destaqueArea.innerHTML = '';
  blocoDestaque.style.display = 'none'; // esconde por padrão

  let encontrouDestaque = false;

  data.perguntas.forEach((p, i) => {
    if (p.destaque === 'true' && !encontrouDestaque) {
  destaqueArea.innerHTML = `
  <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start">
    <p class="me-sm-3 mb-2 mb-sm-0"><strong>${p.nome}:</strong> ${p.pergunta}</p>
    <button class="btn-remover mt-2 mt-sm-0" onclick="removerDestaque()">Remover</button>
  </div>
`;

  blocoDestaque.style.display = 'block';
  encontrouDestaque = true;
}
 else {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>
          <strong>${i + 1}. ${p.nome}:</strong> ${p.pergunta}
        </span>
        <button class="btn-destacar" onclick="destacarPergunta(${i})">Destacar</button>
      `;
      lista.appendChild(li);
    }
  });
}



async function destacarPergunta(index) {
  await fetch(scriptURL + '?destacar=' + index);
  ultimoEstado = null; // <- força recarregamento total
  await carregarPerguntas();
}

async function removerDestaque() {
  await fetch(scriptURL + '?destacar=-1'); // -1 sinaliza "remover todos os destaques"
  ultimoEstado = null;
  await carregarPerguntas();
}


limparBtn.addEventListener('click', async () => {
  if (confirm('Tem certeza que deseja apagar todas as perguntas?')) {
    await fetch(scriptURL + '?limpar=true');
    await carregarPerguntas();
  }
});



setInterval(carregarPerguntas, 10);
carregarPerguntas();
