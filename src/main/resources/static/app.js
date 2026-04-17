let steps = [];
let currentStep = 0;
let interval = null;

let divideRoot = null;
let mergeRoot = null;

/* =========================
   CARGAR
========================= */
function cargar() {

    const input = document.getElementById("input").value;
    const arr = input.split(",").map(x => parseInt(x.trim()));

    steps = [];
    currentStep = 0;

    generateSteps(arr, 0);

    // árbol división empieza SOLO con raíz
    divideRoot = createNode(arr, 0, arr.length - 1);

    // árbol merge vacío
    mergeRoot = createNode([], 0, arr.length - 1);

    renderAll();
}

/* =========================
   GENERAR PASOS (DIV + MERGE)
========================= */
function generateSteps(arr, start) {

    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);

    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    // 🔴 PASO DE DIVISIÓN
    steps.push({
        type: "divide",
        arr: [...arr],
        left: [...leftArr],
        right: [...rightArr],
        start: start,
        end: start + arr.length - 1,
        mensaje: `Dividir [${arr}] → izquierda [${leftArr}] y derecha [${rightArr}]`
    });

    const left = generateSteps(leftArr, start);
    const right = generateSteps(rightArr, start + mid);

    // 🟢 MERGE
    let merged = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {

        if (left[i] < right[j]) {
            merged.push(left[i]);
            steps.push(createMergeStep(left, right, merged, start, arr.length, left[i], "izquierda"));
            i++;
        } else {
            merged.push(right[j]);
            steps.push(createMergeStep(left, right, merged, start, arr.length, right[j], "derecha"));
            j++;
        }
    }

    while (i < left.length) {
        merged.push(left[i]);
        steps.push(createMergeStep(left, right, merged, start, arr.length, left[i], "restante izquierda"));
        i++;
    }

    while (j < right.length) {
        merged.push(right[j]);
        steps.push(createMergeStep(left, right, merged, start, arr.length, right[j], "restante derecha"));
        j++;
    }

    return merged;
}

function createMergeStep(izq, der, res, start, len, val, lado) {
    return {
        type: "merge",
        izquierda: [...izq],
        derecha: [...der],
        resultado: [...res],
        leftIndex: start,
        rightIndex: start + len - 1,
        mensaje: `Comparando [${izq}] y [${der}] → se agrega ${val} (${lado}). Resultado parcial: [${res}]`
    };
}

/* =========================
   NODO
========================= */
function createNode(values, start, end) {
    return {
        values,
        start,
        end,
        left: null,
        right: null,
        animate: false
    };
}

/* =========================
   APLICAR PASOS
========================= */
function applyStep(step) {

    if (step.type === "divide") {
        applyDivide(step);
    } else {
        applyMerge(step);
    }
}

/* =========================
   DIVISIÓN DINÁMICA
========================= */
function applyDivide(step) {

    function update(node) {

        if (!node) return;

        if (node.start === step.start && node.end === step.end) {

            if (!node.left && !node.right) {

                node.left = createNode(
                    step.left,
                    step.start,
                    step.start + step.left.length - 1
                );

                node.right = createNode(
                    step.right,
                    step.start + step.left.length,
                    step.end
                );
            }
        }

        update(node.left);
        update(node.right);
    }

    update(divideRoot);
}

/* =========================
   MERGE
========================= */
function applyMerge(step) {

    function update(node) {

        if (!node) return;

        if (node.start === step.leftIndex && node.end === step.rightIndex) {

            if (!node.left && !node.right) {

                node.left = createNode(
                    step.izquierda,
                    step.leftIndex,
                    step.leftIndex + step.izquierda.length - 1
                );

                node.right = createNode(
                    step.derecha,
                    step.rightIndex - step.derecha.length + 1,
                    step.rightIndex
                );
            }

            node.values = [...step.resultado];
            node.animate = true;
        }

        update(node.left);
        update(node.right);
    }

    update(mergeRoot);
}

/* =========================
   RENDER
========================= */
function renderAll() {

    renderTree(divideRoot, "treeDivide", false);
    renderTree(mergeRoot, "treeMerge", true);

    if (steps[currentStep]) {
        document.getElementById("msg").innerText = steps[currentStep].mensaje;
    }
}

function renderTree(root, id, isMerge) {

    const container = document.getElementById(id);
    container.innerHTML = "";

    function render(node) {

        if (!node) return null;

        const div = document.createElement("div");
        div.className = "tree-node";

        const arr = document.createElement("div");
        arr.className = "array";

        node.values.forEach(v => {
            const box = document.createElement("div");
            box.className = "box";
            if (node.animate) box.classList.add("merge-anim");
            box.innerText = v;
            arr.appendChild(box);
        });

        if (isMerge && (node.left || node.right)) {

            const children = document.createElement("div");
            children.className = "tree-children";

            if (node.left) children.appendChild(render(node.left));
            if (node.right) children.appendChild(render(node.right));

            div.appendChild(children);
            div.appendChild(arr);

        } else {

            div.appendChild(arr);

            if (node.left || node.right) {

                const children = document.createElement("div");
                children.className = "tree-children";

                if (node.left) children.appendChild(render(node.left));
                if (node.right) children.appendChild(render(node.right));

                div.appendChild(children);
            }
        }

        node.animate = false;
        return div;
    }

    container.appendChild(render(root));
}

/* =========================
   CONTROLES
========================= */
function next() {

    if (currentStep >= steps.length) return;

    applyStep(steps[currentStep]);
    currentStep++;

    renderAll();
}

function prev() {

    if (currentStep <= 0) return;

    currentStep--;

    // reiniciar árboles
    divideRoot = createNode(divideRoot.values, 0, divideRoot.values.length - 1);
    mergeRoot = createNode([], 0, divideRoot.values.length - 1);

    for (let i = 0; i < currentStep; i++) {
        applyStep(steps[i]);
    }

    renderAll();
}

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
/* =========================
   GENERAR ALEATORIOS
========================= */
function generarAleatorio() {

    let arr = [];

    for (let i = 0; i < 9; i++) {
        arr.push(Math.floor(Math.random() * 50) + 1);
    }

    document.getElementById("input").value = arr.join(",");
}

/* =========================
   LEER CSV
========================= */
function leerCSV(event) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        let contenido = e.target.result;

        // separar por comas, saltos de línea o espacios
        let valores = contenido
            .split(/[\s,;\n\r]+/)
            .map(x => x.trim())
            .filter(x => x !== "")
            .map(x => parseInt(x));

        // limpiar NaN
        valores = valores.filter(x => !isNaN(x));

        document.getElementById("input").value = valores.join(",");
    };

    reader.readAsText(file);
}