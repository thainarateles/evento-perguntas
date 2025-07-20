const form = document.getElementById('form-pergunta');
const lista = document.getElementById('lista-perguntas');
const destaqueArea = document.getElementById('pergunta-destacada');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

// Cache local da última pergunta enviada
let perguntaPendente = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim() || 'Anônimo';
  const pergunta = document.getElementById('pergunta').value;

  // Armazena no cache temporário
  perguntaPendente = { nome, pergunta, destaque: 'false' };

  // Envia para o Google Sheets
  await fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({ nome, pergunta })
  });

  // Limpa os campos
  document.getElementById('nome').value = '';
  document.getElementById('pergunta').value = '';

  carregarPerguntas();
});

async function carregarPerguntas() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  // Junta perguntas do servidor + cache (pendente)
  let perguntasParaExibir = [...data.perguntas];

  // Adiciona pendente (se ainda não está no servidor)
  if (perguntaPendente) {
    const existe = perguntasParaExibir.some(p =>
      p.nome === perguntaPendente.nome &&
      p.pergunta === perguntaPendente.pergunta
    );

    if (!existe) {
      perguntasParaExibir.push(perguntaPendente);
    } else {
      // Se já está no servidor, limpamos o cache
      perguntaPendente = null;
    }
  }

  // Atualiza destaque
  destaqueArea.innerHTML = '';
  const perguntaDestacada = perguntasParaExibir.find(p => p.destaque === 'true');
  if (perguntaDestacada) {
    destaqueArea.innerHTML = `
      <div class="alert alert-info">
        <strong>Respondendo agora:</strong> ${perguntaDestacada.nome}: ${perguntaDestacada.pergunta}
      </div>
    `;
    destaqueArea.classList.remove('d-none');
  } else {
    destaqueArea.classList.add('d-none');
  }

  // Renderiza lista inteira (mais recentes primeiro)
  lista.innerHTML = '';
  perguntasParaExibir.reverse().forEach(p => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<strong>${p.nome}:</strong> ${p.pergunta}`;
    lista.appendChild(li);
  });
}

// Atualiza a cada 5 segundos
setInterval(carregarPerguntas, 5000);
carregarPerguntas();
