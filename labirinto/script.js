document.addEventListener('DOMContentLoaded', () => {
  const GRID_SIZE = 15;
  const CANVAS_SIZE = 560;
  const CELL = Math.floor(CANVAS_SIZE / GRID_SIZE);
  const playerImages = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image(),
    frente: new Image(),
    costas: new Image()
  };

  playerImages.up.src = 'img/jogador/cima.png';
  playerImages.down.src = 'img/jogador/baixo.png';
  playerImages.left.src = 'img/jogador/esquerda.png';
  playerImages.right.src = 'img/jogador/direita.png';
  playerImages.frente.src = 'img/jogador/frente.png';
  playerImages.costas.src = 'img/jogador/costas.png';


  const MAZE_LAYOUT = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  playerDirection = 'right';
  let player = { x: 1, y: 1 };
  let gameWon = false;
  let showHint = false;

  const canvas = document.getElementById('mazeCanvas');
  if (!canvas) {
    console.error('Canvas não encontrado: verifique se existe <canvas id="mazeCanvas">');
    return;
  }
  const ctx = canvas.getContext('2d');

  const overlay = document.getElementById('overlay');
  const continueBtn = document.getElementById('continueBtn');
  const upBtn = document.getElementById('upBtn');
  const downBtn = document.getElementById('downBtn');
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const resetBtn = document.getElementById('resetBtn');
  const messageEl = document.getElementById('message');

  function showMessage(text, color = 'lime', duration = 1400) {
    if (!messageEl) { console.log(text); return; }
    messageEl.textContent = text;
    messageEl.style.color = color;
    // efeito simples: piscar
    messageEl.style.opacity = '1';
    clearTimeout(showMessage._t);
    showMessage._t = setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => { messageEl.textContent = ''; messageEl.style.opacity = '1'; }, 300);
    }, duration);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const type = MAZE_LAYOUT[r][c];
        const x = c * CELL, y = r * CELL;

        // se quiser paredes invisíveis, pinta igual ao caminho (já é o que você pediu)
        if (type === 1) {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--path') || '#24e04dff';
          ctx.fillRect(x, y, CELL, CELL);
        } else if (type === 2) {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--exit') || '#fff7beff';
          ctx.fillRect(x, y, CELL, CELL);
          ctx.fillStyle = '#f59e0b';
          const size = Math.max(6, Math.floor(CELL * 0.35));
          ctx.fillRect(x + (CELL - size) / 2, y + (CELL - size) / 2, size, size);
        } else {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--path') || '#62916cff';
          ctx.fillRect(x, y, CELL, CELL);
        }

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.strokeRect(x, y, CELL, CELL);
      }
    }

    if (showHint) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (MAZE_LAYOUT[r][c] === 2) {
            ctx.fillStyle = 'rgba(255, 205, 0, 0.18)';
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          }
        }
      }
    }

    const px = player.x * CELL;
    const py = player.y * CELL;

    ctx.drawImage(playerImages[playerDirection], px, py, CELL, CELL);

  }

  function canMoveTo(x, y) {
    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return false;
    return MAZE_LAYOUT[y][x] !== 1;
  }

  function move(dx, dy) {
    if (gameWon) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    if (dx === 1) playerDirection = 'right';
    if (dx === -1) playerDirection = 'left';
    if (dy === 1) playerDirection = 'down';
    if (dy === -1) playerDirection = 'up';

    if (!canMoveTo(nx, ny)) {
      showMessage('🚫 Caminho errado! Volte ao início.', 'red', 1000);
      player = { x: 1, y: 1 };
      draw();
      return;
    }

    player.x = nx;
    player.y = ny;
    draw();

    if (MAZE_LAYOUT[ny][nx] === 2) {
      if (continueBtn) continueBtn.style.display = 'block';
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); move(0, -1); }
    if (e.key === 'ArrowDown') { e.preventDefault(); move(0, 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1, 0); }
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1, 0); }
  });

  if (upBtn) upBtn.addEventListener('click', () => move(0, -1));
  if (downBtn) downBtn.addEventListener('click', () => move(0, 1));
  if (leftBtn) leftBtn.addEventListener('click', () => move(-1, 0));
  if (rightBtn) rightBtn.addEventListener('click', () => move(1, 0));
  if (resetBtn) resetBtn.addEventListener('click', () => {
    player = { x: 1, y: 1 };
    gameWon = false;
    showHint = false;
    if (overlay) overlay.style.display = 'none';
    draw();
    document.getElementById("continueBtn").style.display = "block";
  });
  document.getElementById("continueBtn").addEventListener("click", function () {
    window.location.href = "recompensa.html";
  });

  function fixCanvasDPR() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  fixCanvasDPR();
  draw();
});
