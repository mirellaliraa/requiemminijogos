const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");
const btn = document.getElementById("continueBtn");

const imagem = new Image();
imagem.src = "img/bateria_litio.png";

// multiplica por 61 pra gerar um número entre 0 e 60
// isso pq os sliders vao de 0 a 100, e para dificultar coloquei entre 20 e 80
const centro1 = Math.floor(Math.random() * 61) + 20;
const centro2 = Math.floor(Math.random() * 61) + 20;

// espera a imagem carregar, aí coloca os sliders em valores iniciais (10 e 90) e chama a função desenhar() pra mostrar a imagem.
imagem.onload = () => {
  slider1.value = 10;
  slider2.value = 90;
  desenhar();
};

// desenha a imagem e decide se ela vai aparecer embaçada ou nítida, com base na posição dos sliders
function desenhar() {
  const pos1 = parseInt(slider1.value); // pega os valores que o jogador colocou nos sliders
  const pos2 = parseInt(slider2.value);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.abs(pos1 - centro1) < 5 && Math.abs(pos2 - centro2) < 5) {
    btn.style.display = "inline-block";
    ctx.filter = "none"; // se o jogador acertar a posição dos sliders, deixa a imagem nítida e aparece o botão de continuar
  } else if (Math.abs(pos1 - centro1) < 20 && Math.abs(pos2 - centro2) < 20) { // pos1 = valor atual do slider1, centro1 = posição correta que o slider1 precisa alcançar | Math.abs() tira o sinal negativo, transforma qualquer número em valor absoluto | se os dois sliders estiverem a menos de 5 unidades de distância dos seus valores secretos, então o jogador acertou
    btn.style.display = "none"; 
    ctx.filter = "blur(3px)"; // se o jogador chegar perto mostra a imagem com borrão leve
  } else { // se o jogador está bem longe a imagem fica bem borrada
    btn.style.display = "none";
    ctx.filter = "blur(8px)";
  }

  ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height); // desenha a imagem no canvas
}

slider1.addEventListener("input", desenhar); // toda vez que você mexe nos sliders, ele redesenha a imagem com outro nível de borrão
slider2.addEventListener("input", desenhar);

btn.addEventListener("click", () => {
  window.location.href = "recompensa.html";
});
