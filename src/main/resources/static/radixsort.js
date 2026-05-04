let steps = [];
let current = 0;
let interval = null;

function cargar() {

    let arr = document.getElementById("input").value
        .split(",")
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x));

    generarPasos(arr);
    current = 0;
    render();
}

function generarPasos(arr) {

    steps = [];
    let max = Math.max(...arr);

    let exp = 1;

    while (Math.floor(max / exp) > 0) {

        let buckets = Array.from({length: 10}, () => []);

        arr.forEach(num => {
            let digit = Math.floor(num / exp) % 10;
            buckets[digit].push(num);
        });

        steps.push({
            tipo: "distribucion",
            buckets: JSON.parse(JSON.stringify(buckets)),
            mensaje: `Distribuyendo por dígito ${exp}`
        });

        arr = [].concat(...buckets);

        steps.push({
            tipo: "recoleccion",
            array: [...arr],
            mensaje: `Recolectando elementos`
        });

        exp *= 10;
    }
}

function render() {

    document.getElementById("buckets").innerHTML = "";
    document.getElementById("array").innerHTML = "";

    let step = steps[current];
    if (!step) return;

    document.getElementById("msg").innerText = step.mensaje;

    if (step.tipo === "distribucion") {

        step.buckets.forEach((b, i) => {

            let div = document.createElement("div");
            div.className = "bucket";

            div.innerHTML = `<div class="bucket-title">Bucket ${i}</div>`;

            let cont = document.createElement("div");
            cont.className = "bucket-array";

            b.forEach(n => {
                let box = document.createElement("div");
                box.className = "box anim";
                box.innerText = n;
                cont.appendChild(box);
            });

            div.appendChild(cont);
            document.getElementById("buckets").appendChild(div);
        });
    }

    if (step.tipo === "recoleccion") {

        let cont = document.getElementById("array");

        step.array.forEach(n => {
            let box = document.createElement("div");
            box.className = "box anim";
            box.innerText = n;
            cont.appendChild(box);
        });
    }
}

function next() {
    if (current < steps.length - 1) {
        current++;
        render();
    }
}

function prev() {
    if (current > 0) {
        current--;
        render();
    }
}

function play() {
    interval = setInterval(() => {
        if (current >= steps.length - 1) return pause();
        next();
    }, 800);
}

function pause() {
    clearInterval(interval);
}

/* extras */
function generarAleatorio() {
    let arr = [];
    for (let i = 0; i < 9; i++) {
        arr.push(Math.floor(Math.random() * 999));
    }
    document.getElementById("input").value = arr.join(",");
}

function leerCSV(e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function(ev) {
        let data = ev.target.result.split(/[\s,;\n]+/)
            .map(x => parseInt(x))
            .filter(x => !isNaN(x));

        document.getElementById("input").value = data.join(",");
    };

    reader.readAsText(file);
}