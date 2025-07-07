let despertadorAtivo = false;
let horarioProgramado = "";
let acaoEscolhida = "";
let testeAtivo = false;
let musicaSelecionada = null;
const audio = document.getElementById("audio");

function atualizarRelogio() {
  const agora = new Date();
  const hora = agora.toLocaleTimeString("pt-BR", { hour12: false });
  document.getElementById("relogio").textContent = hora;

  const horaAtual = agora.toTimeString().slice(0, 5); // HH:MM
  if (despertadorAtivo && horaAtual === horarioProgramado) {
    executarAcao();
    // Após executar a ação, desativar o despertador e não permitir mais que seja reativado até ser manualmente ativado.
    despertadorAtivo = false;
    atualizarStatus();
  }
}

setInterval(atualizarRelogio, 1000);

function falarHora() {
  const hora = new Date().toLocaleTimeString("pt-BR");
  const fala = new SpeechSynthesisUtterance(`Agora são ${hora}`);
  speechSynthesis.speak(fala);
  fala.onend = function() {
    // Após terminar a fala, não fazer mais nada.
    atualizarStatus("Despertador: Desativado");
  };
}

function ativarDespertador() {
  const horario = document.getElementById("horario").value;
  if (!horario) return alert("Escolha um horário!");
  horarioProgramado = horario;
  acaoEscolhida = document.getElementById("acao").value;
  musicaSelecionada = document.getElementById("musica").files[0] || null;
  despertadorAtivo = true;
  atualizarStatus("Despertador: Ativado");
}

function desativarDespertador() {
  // Desativar o despertador manualmente
  despertadorAtivo = false;
  testeAtivo = false;
  audio.pause();
  audio.currentTime = 0;
  speechSynthesis.cancel();
  atualizarStatus("Despertador: Desativado");
}

function testeDespertador() {
  // Parar qualquer execução anterior de fala ou música
  speechSynthesis.cancel();
  audio.pause();
  audio.currentTime = 0;

  // Executar a ação de teste
  acaoEscolhida = document.getElementById("acao").value;
  musicaSelecionada = document.getElementById("musica").files[0] || null;
  testeAtivo = true;
  executarAcao();
}

function executarAcao() {
  if (acaoEscolhida === "falar") {
    falarHora();
  } else if (acaoEscolhida === "musica" && musicaSelecionada) {
    const url = URL.createObjectURL(musicaSelecionada);
    audio.src = url;
    audio.onended = function() {
      URL.revokeObjectURL(url);
      // Quando a música acabar, o despertador será desativado
      atualizarStatus("Despertador: Desativado");
    };
    audio.onerror = () => {
      alert("Erro ao carregar a música.");
      URL.revokeObjectURL(url);
    };
    audio.play();
  }
}

function atualizarStatus(mensagemExtra = "") {
  const status = document.getElementById("status");
  if (despertadorAtivo || testeAtivo) {
    status.className = "ativado";
    status.textContent = mensagemExtra || "Despertador: Ativado";
  } else {
    status.className = "desativado";
    status.textContent = mensagemExtra || "Despertador: Desativado";
  }
}

function alterarImagem() {
  const arquivo = document.getElementById("fundo").files[0];
  if (arquivo) {
    const url = URL.createObjectURL(arquivo);
    document.body.style.backgroundImage = `url(${url})`;
    document.getElementById("removerFundo").style.display = "block";
  }
}

function removerImagem() {
  document.body.style.backgroundImage = "";
  document.getElementById("fundo").value = "";
  document.getElementById("removerFundo").style.display = "none";
}

document.getElementById("btn-ativar").addEventListener("click", ativarDespertador);
document.getElementById("btn-desativar").addEventListener("click", desativarDespertador);
document.getElementById("btn-falar").addEventListener("click", falarHora);
document.getElementById("btn-teste").addEventListener("click", testeDespertador);
document.getElementById("fundo").addEventListener("change", alterarImagem);
document.getElementById("removerFundo").addEventListener("click", removerImagem);