const palavras = [
    { original: "fragmentos", anagrama: "sogarnfret" },
    { original: "do", anagrama: "od" },
    { original: "mundo", anagrama: "odmnu" },
    { original: "ainda", anagrama: "aidan" },
    { original: "ecoam", anagrama: "moeca" },
];

let indice = 0;
  let fraseFinal = [];

  const anagramaEl = document.getElementById("anagrama");
  const respostaEl = document.getElementById("resposta");
  const checkEl = document.getElementById("check");
  const fraseEl = document.getElementById("frase");

  function mostrarAnagrama() {
    anagramaEl.textContent = palavras[indice].anagrama.toUpperCase();
    respostaEl.value = "";
    respostaEl.placeholder = "_".repeat(palavras[indice].original.length);
    respostaEl.focus();
  }

  function verificarResposta() {
    const resposta = respostaEl.value.trim().toLowerCase();
    const correta = palavras[indice].original.toLowerCase();

    if (resposta === correta) {
      fraseFinal.push(palavras[indice].original);
      indice++;
      if (indice < palavras.length) {
        mostrarAnagrama();
      } else {
        document.querySelector(".caixinha").style.display = "none";
        checkEl.style.display = "block";
        fraseEl.textContent = "Frase formada: " + fraseFinal.join(" ");
      }
    } else {
      respostaEl.style.backgroundColor = "#f8d7da";
      setTimeout(() => {
        respostaEl.style.backgroundColor = "#f7fcb6";
      }, 500);
    }
  }

  mostrarAnagrama();