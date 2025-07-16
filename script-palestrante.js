const lista = document.getElementById('lista-palestrante');
const limparBtn = document.getElementById('limpar');
const perguntaDestaqueContainer = document.getElementById('pergunta-destaque-container');
const perguntaDestaquTexto = document.getElementById('pergunta-destaque-texto');
const btnRemoverDestaque = document.getElementById('btn-remover-destaque');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOamNO8FOf6EedVU_SIL15LosL699YOfGH7--Ww8HzanUY_2vKNmFcjTn666SIoVOU6Q/exec';

let ultimoEstado = null;
let perguntaDestacada = null;

async function carregarPerguntas() {
  try {
    const res = await fetch(scriptURL);
    const data = await res.json();

    const novoEstado = JSON.stringify(data.perguntas);
    if (novoEstado !== ultimoEstado || ultimoEstado === null) {
      ultimoEstado = novoEstado;
      lista.innerHTML = '';

      // Procurar por pergunta destacada
      const perguntaComDestaque = data.perguntas.find(p => p.destaque === 'true');
      
      if (perguntaComDestaque) {
        perguntaDestacada = perguntaComDestaque;
        perguntaDestaquTexto.innerHTML = `<strong>${perguntaComDestaque.nome}:</strong> ${perguntaComDestaque.pergunta}`;
        perguntaDestaqueContainer.style.display = 'block';
      } else {
        perguntaDestacada = null;
        perguntaDestaqueContainer.style.display = 'none';
      }

      // Mostrar outras perguntas (exceto a destacada)
      data.perguntas.forEach((p, i) => {
        if (p.destaque !== 'true') {
          const li = document.createElement('li');
          li.className = 'list-group-item d-flex justify-content-between align-items-center';

          li.innerHTML = `
            <span>
              <strong>${p.nome}:</strong> ${p.pergunta}
            </span>
            <div class="btn-group" role="group">
              <button class="btn btn-outline-warning btn-sm" onclick="destacarPergunta(${i})">Destacar</button>
              <button class="btn btn-outline-success btn-sm" onclick="removerPergunta(${i})">✓ Respondido</button>
            </div>
          `;
          lista.appendChild(li);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error);
  }
}

async function destacarPergunta(index) {
  try {
    await fetch(scriptURL + '?destacar=' + index);
    carregarPerguntas(); // Sem delay
  } catch (error) {
    console.error('Erro ao destacar pergunta:', error);
  }
}

async function removerPergunta(index) {
  try {
    await fetch(scriptURL + '?remover=' + index);
    carregarPerguntas(); // Sem delay
  } catch (error) {
    console.error('Erro ao remover pergunta:', error);
  }
}

// Botão para remover pergunta destacada
btnRemoverDestaque.addEventListener('click', async () => {
  if (perguntaDestacada) {
    try {
      // Encontrar o índice da pergunta destacada
      const res = await fetch(scriptURL);
      const data = await res.json();
      const index = data.perguntas.findIndex(p => p.destaque === 'true');
      
      if (index !== -1) {
        await fetch(scriptURL + '?remover=' + index);
        carregarPerguntas(); // Sem delay
      }
    } catch (error) {
      console.error('Erro ao remover pergunta destacada:', error);
    }
  }
});

limparBtn.addEventListener('click', async () => {
  if (confirm('Tem certeza que deseja apagar todas as perguntas?')) {
    try {
      await fetch(scriptURL + '?limpar=true');
      carregarPerguntas(); // Sem delay
    } catch (error) {
      console.error('Erro ao limpar perguntas:', error);
    }
  }
});

// Carregamento sem delay
setInterval(carregarPerguntas, 1000);
carregarPerguntas(); // Carregamento inicial imediato