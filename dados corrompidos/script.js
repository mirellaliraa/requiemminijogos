const palavras = [
    { original: "Fragmentos", anagrama: "sogarnFret" },
    { original: "do", anagrama: "od" },
    { original: "mundo", anagrama: "odmnu" },
    { original: "ainda", anagrama: "aidan" },
    { original: "ecoam", anagrama: "moeca" },
];

let indice = 0;
  let fraseFinal = [];

  const anagramaEl = document.getElementById("anagrama");
  const respostaEl = document.getElementById("resposta");
  const fraseEl = document.getElementById("frase");

  respostaEl.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      verificarResposta();
    }
  });

  function mostrarAnagrama() {
    anagramaEl.textContent = palavras[indice].anagrama.toUpperCase();
    respostaEl.value = "";
    respostaEl.placeholder = "Resposta"(palavras[indice].original.length);
    respostaEl.focus();
  }

  function verificarResposta() {
    const resposta = respostaEl.value.trim().toLowerCase();
    const correta = palavras[indice].original.toLowerCase();

    if (resposta === correta) {
      respostaEl.style.backgroundColor = "transparent";
      fraseFinal.push(palavras[indice].original);
      indice++;
      if (indice < palavras.length) {
        mostrarAnagrama();
      } else {
        document.querySelector(".caixa").style.display = "none";
        function mostrarFraseComTyping(texto, elemento, velocidade = 50) {
      elemento.innerHTML = "";
      let i = 0;
      function digitar() {
        if (i < texto.length) {
        elemento.innerHTML += texto.charAt(i);
        i++;
        setTimeout(digitar, velocidade);
      }
    }
    digitar();
  }
        document.getElementById("continueBtn").style.display = "block";
      }
    } else {
      respostaEl.style.backgroundColor = "#FF0000";
    }
    mostrarFraseComTyping(" " + fraseFinal.join(" "), fraseEl);
  }

  document.getElementById("continueBtn").addEventListener("click", function() {
  window.location.href = "recompensa.html";
});

  mostrarAnagrama();