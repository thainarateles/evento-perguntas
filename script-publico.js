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

  // Remove pergunta pendente se já estiver no servidor
  if (perguntaPendente) {
  const existe = data.perguntas.some(p =>
    p.nome === perguntaPendente.nome &&
    p.pergunta === perguntaPendente.pergunta
  );

  // Só apaga se tiver certeza que chegou no servidor
  if (existe) {
    perguntaPendente = null;
  } else {
    // Reinsere no final da lista, mas só se ainda não estiver lá
    data.perguntas.push(perguntaPendente);
  }
}

  // Junta perguntas do servidor + cache
  let perguntasParaExibir = [...data.perguntas];
  if (perguntaPendente) {
    perguntasParaExibir.push(perguntaPendente);
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
  }

  // Lista todas as perguntas
  // Gera uma chave única para cada pergunta (pode ser ajustado conforme necessidade)
function gerarChave(p) {
  return `${p.nome}-${p.pergunta}`;
}

// Cria um Set com as chaves das perguntas já exibidas
const perguntasExistentes = new Set();
lista.querySelectorAll('li').forEach(li => {
  perguntasExistentes.add(li.getAttribute('data-chave'));
});

// Adiciona apenas perguntas novas
perguntasParaExibir.forEach(p => {
  const chave = gerarChave(p);
  if (!perguntasExistentes.has(chave)) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.setAttribute('data-chave', chave);
    li.innerHTML = `<strong>${p.nome}:</strong> ${p.pergunta}`;
    lista.appendChild(li);
  }
});

}

// Atualiza a cada 5 segundos
setInterval(carregarPerguntas, 5000);
carregarPerguntas();
