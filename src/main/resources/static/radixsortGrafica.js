const sizes = [1000, 2000, 3000, 4000, 5000, 7000, 10000];

let tiempos = [];

/* =========================
   GENERAR DATOS
========================= */
function generar(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 100000));
    }
    return arr;
}

/* =========================
   RADIX SORT
========================= */
function radix(arr) {

    let max = Math.max(...arr);
    let exp = 1;

    while (Math.floor(max / exp) > 0) {

        let buckets = Array.from({ length: 10 }, () => []);

        for (let num of arr) {
            let d = Math.floor(num / exp) % 10;
            buckets[d].push(num);
        }

        arr = [].concat(...buckets);
        exp *= 10;
    }

    return arr;
}

/* =========================
   MEDICIÓN REAL
========================= */
function medir() {

    tiempos = [];

    for (let n of sizes) {

        let arr = generar(n);

        // 🔥 Medición por bloque (CLAVE)
        let t0 = performance.now();

        for (let i = 0; i < 300; i++) {
            radix([...arr]); // copiar para evitar mutación
        }

        let t1 = performance.now();

        let tiempo = (t1 - t0) / 300;

        // 🔥 Si sigue siendo muy pequeño, escalar
        if (tiempo < 0.01) {
            tiempo = tiempo * 1000;
        }

        tiempos.push(tiempo);
    }

    console.log("TIEMPOS MEDIDOS:", tiempos);

    graficar();
}

/* =========================
   GRÁFICA
========================= */
function graficar() {

    // 🔥 NORMALIZAR TIEMPOS
    let maxTiempo = Math.max(...tiempos);
    let tiemposNorm = tiempos.map(t => t / maxTiempo);

    // 🔥 NORMALIZAR T(n)
    let teorico = sizes.map(n => n * 5);
    let maxTeorico = Math.max(...teorico);
    let teoricoNorm = teorico.map(t => t / maxTeorico);

    new Chart(document.getElementById("chart"), {
        type: 'line',
        data: {
            labels: sizes,
            datasets: [
                {
                    label: 'RadixSort (normalizado)',
                    data: tiemposNorm,
                    tension: 0.3
                },
                {
                    label: 'T(n) ≈ n*k (normalizado)',
                    data: teoricoNorm,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'white' }
                },
                y: {
                    ticks: { color: 'white' }
                }
            }
        }
    });
}

/* =========================
   INICIO
========================= */
medir();