let steps = [];
let currentStep = 0;
let interval = null;

let root = null;
let sorted = [];

/* ======================
   CARGAR
====================== */
function cargar() {

    const input = document.getElementById("input").value;

    const arr = input.split(",")
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x));

    if (arr.length === 0) {
        alert("Ingresa datos válidos");
        return;
    }

    steps = [];
    currentStep = 0;
    root = null;
    sorted = [];

    generarPasos(arr);

    renderAll();
}

/* ======================
   GENERAR PASOS
====================== */
function generarPasos(arr) {

    // pasos de inserción
    arr.forEach(v => {
        steps.push({
            tipo: "insert",
            valor: v,
            mensaje: `Insertando ${v} en el árbol`
        });
    });

    // construir árbol temporal
    let tempRoot = null;
    arr.forEach(v => tempRoot = insert(tempRoot, v));

    // recorrido inorder
    generarInOrder(tempRoot);
}

/* ======================
   INORDER
====================== */
function generarInOrder(node) {

    if (!node) return;

    generarInOrder(node.left);

    sorted.push(node.value);

    steps.push({
        tipo: "visit",
        valor: node.value,
        resultado: [...sorted],
        mensaje: `Visitando ${node.value} → parcial: [${sorted}]`
    });

    generarInOrder(node.right);
}

/* ======================
   INSERT
====================== */
function insert(node, val) {

    if (!node) {
        return { value: val, left: null, right: null, highlight: false };
    }

    if (val < node.value) {
        node.left = insert(node.left, val);
    } else {
        node.right = insert(node.right, val);
    }

    return node;
}

/* ======================
   APLICAR PASO
====================== */
function applyStep(step) {

    if (step.tipo === "insert") {
        root = insert(root, step.valor);
    }

    if (step.tipo === "visit") {
        highlight(root, step.valor);
    }
}

/* ======================
   HIGHLIGHT
====================== */
function highlight(node, val) {

    if (!node) return;

    if (node.value === val) {
        node.highlight = true;
    }

    highlight(node.left, val);
    highlight(node.right, val);
}

/* ======================
   RENDER
====================== */
function renderAll() {

    renderTree(root);
    renderSorted();

    if (steps[currentStep]) {
        document.getElementById("msg").innerText = steps[currentStep].mensaje;
    }
}

/* árbol tipo binario */
function renderTree(node) {

    const container = document.getElementById("tree");
    container.innerHTML = "";

    if (!node) return;

    container.appendChild(drawNode(node));
}

function drawNode(node) {

    const div = document.createElement("div");
    div.className = "tree-node";

    const box = document.createElement("div");
    box.className = "node";

    if (node.highlight) box.classList.add("highlight");

    box.innerText = node.value;

    div.appendChild(box);

    if (node.left || node.right) {

        const children = document.createElement("div");
        children.className = "tree-children";

        // izquierda
        if (node.left) {
            const leftDiv = document.createElement("div");
            leftDiv.className = "child";

            const label = document.createElement("div");
            label.className = "label";
            label.innerText = "L";

            leftDiv.appendChild(label);
            leftDiv.appendChild(drawNode(node.left));

            children.appendChild(leftDiv);
        }

        // derecha
        if (node.right) {
            const rightDiv = document.createElement("div");
            rightDiv.className = "child";

            const label = document.createElement("div");
            label.className = "label";
            label.innerText = "R";

            rightDiv.appendChild(label);
            rightDiv.appendChild(drawNode(node.right));

            children.appendChild(rightDiv);
        }

        div.appendChild(children);
    }

    return div;
}

/* resultado */
function renderSorted() {

    const div = document.getElementById("sorted");
    div.innerHTML = "";

    if (!steps[currentStep] || !steps[currentStep].resultado) return;

    const arr = document.createElement("div");
    arr.className = "array";

    steps[currentStep].resultado.forEach(v => {
        const box = document.createElement("div");
        box.className = "box anim";
        box.innerText = v;
        arr.appendChild(box);
    });

    div.appendChild(arr);
}

/* ======================
   CONTROLES
====================== */
function next() {
    if (currentStep >= steps.length) return;

    applyStep(steps[currentStep]);
    currentStep++;
    renderAll();
}

function prev() {

    if (currentStep <= 0) return;

    currentStep--;
    reconstruir();
    renderAll();
}

function reconstruir() {

    root = null;
    sorted = [];

    for (let i = 0; i < currentStep; i++) {
        applyStep(steps[i]);
    }
}

/* play/pause */
function play() {

    if (interval) return;

    interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            interval = null;
            return;
        }
        next();
    }, 800);
}

function pause() {
    clearInterval(interval);
    interval = null;
}

/* ======================
   UTILIDADES
====================== */
function generarAleatorio() {

    let arr = [];

    for (let i = 0; i < 9; i++) {
        arr.push(Math.floor(Math.random() * 50) + 1);
    }

    document.getElementById("input").value = arr.join(",");
}

function leerCSV(event) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        let valores = e.target.result
            .split(/[\s,;\n\r]+/)
            .map(x => parseInt(x))
            .filter(x => !isNaN(x));

        document.getElementById("input").value = valores.join(",");
    };

    reader.readAsText(file);
}
function abrirModal() {
    document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}