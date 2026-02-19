body {
  margin: 0;
  font-family: Arial;
  text-align: center;
  background: radial-gradient(circle at top, #05051a, black);
  color: white;
}

h1 {
  margin-top: 20px;
  font-size: 45px;
  color: cyan;
  text-shadow: 0 0 20px cyan;
}

.subtitle {
  color: lightgray;
  font-size: 18px;
}

#canvas {
  width: 90%;
  height: 520px;
  margin: 25px auto;
  border-radius: 20px;
  border: 2px solid cyan;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(0,255,255,0.4);
}

/* Nodo */
.node {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  position: absolute;
  background: lime;
  box-shadow: 0 0 20px lime;
  cursor: pointer;

  transform: scale(0);
  animation: pop 0.3s forwards;
}

@keyframes pop {
  to {
    transform: scale(1);
  }
}

/* Botón */
button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: cyan;
  color: black;
  box-shadow: 0 0 15px cyan;
}

button:hover {
  background: lime;
  box-shadow: 0 0 20px lime;
}

.info {
  margin-top: 15px;
  color: gray;
}
const canvas = document.getElementById("canvas");
const clearBtn = document.getElementById("clearBtn");

let nodes = [];
let selectedNode = null;

/* Crear SVG para dibujar aristas */
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");
svg.style.position = "absolute";
canvas.appendChild(svg);

/* Crear nodo */
function createNode(x, y) {
  const node = document.createElement("div");
  node.classList.add("node");

  node.style.left = ${x - 17}px;
  node.style.top = ${y - 17}px;

  canvas.appendChild(node);

  const nodeData = { element: node, x, y };
  nodes.push(nodeData);

  node.addEventListener("click", (e) => {
    e.stopPropagation();
    handleNodeClick(nodeData);
  });
}

/* Dibujar arista curva dirigida */
function drawArrow(from, to) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // Curvatura
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const curve = 0.25;

  const cx = from.x + dx * 0.5 - dy * curve;
  const cy = from.y + dy * 0.5 + dx * curve;

  const d = M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y};

  path.setAttribute("d", d);
  path.setAttribute("stroke", "yellow");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("fill", "none");
  path.style.filter = "drop-shadow(0 0 8px yellow)";

  svg.appendChild(path);

  // Flecha final
  const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

  arrowHead.setAttribute("points", `
    ${to.x},${to.y}
    ${to.x - 10},${to.y - 6}
    ${to.x - 10},${to.y + 6}
  `);

  arrowHead.setAttribute("fill", "yellow");
  svg.appendChild(arrowHead);
}

/* Dibujar bucle */
function drawLoop(node) {
  const loop = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  loop.setAttribute("cx", node.x + 20);
  loop.setAttribute("cy", node.y - 20);
  loop.setAttribute("r", "18");

  loop.setAttribute("stroke", "orange");
  loop.setAttribute("stroke-width", "3");
  loop.setAttribute("fill", "none");
  loop.style.filter = "drop-shadow(0 0 8px orange)";

  svg.appendChild(loop);
}

/* Manejar clic en nodo */
function handleNodeClick(node) {
  if (!selectedNode) {
    selectedNode = node;
    node.element.style.background = "red";
  } else {
    // Si es el mismo nodo → bucle
    if (selectedNode === node) {
      drawLoop(node);
    } else {
      drawArrow(selectedNode, node);
    }

    selectedNode.element.style.background = "lime";
    selectedNode = null;
  }
}

/* Clic en canvas crea nodo */
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  createNode(e.clientX - rect.left, e.clientY - rect.top);
});

/* Touch para celular */
canvas.addEventListener("touchstart", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  createNode(touch.clientX - rect.left, touch.clientY - rect.top);
});

/* Limpiar grafo */
clearBtn.addEventListener("click", () => {
  nodes = [];
  selectedNode = null;
  svg.innerHTML = "";
  document.querySelectorAll(".node").forEach(n => n.remove());
});

