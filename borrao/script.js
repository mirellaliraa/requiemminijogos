const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");
const btn = document.getElementById("continueBtn");

const imagem = new Image();
imagem.src = "bateria_litio.png";

const centro1 = Math.floor(Math.random() * 61) + 20;
const centro2 = Math.floor(Math.random() * 61) + 20;

imagem.onload = () => {
  slider1.value = 10;
  slider2.value = 90;
  desenhar();
};

function desenhar() {
  const pos1 = parseInt(slider1.value);
  const pos2 = parseInt(slider2.value);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.abs(pos1 - centro1) < 5 && Math.abs(pos2 - centro2) < 5) {
    btn.style.display = "inline-block";
    ctx.filter = "none"; // imagem nítida
  } else if (Math.abs(pos1 - centro1) < 20 && Math.abs(pos2 - centro2) < 20) {
    btn.style.display = "none";
    ctx.filter = "blur(3px)";
  } else {
    btn.style.display = "none";
    ctx.filter = "blur(8px)";
  }

  ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);
}

slider1.addEventListener("input", desenhar);
slider2.addEventListener("input", desenhar);

btn.addEventListener("click", () => {
  window.location.href = "recompensa.html";
});
