const sizes = [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000];

let tiempos = [];

function generarArreglo(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 10000));
    }
    return arr;
}

/* BST */
function insertar(root, val) {
    if (!root) return { val, left: null, right: null };

    if (val < root.val) root.left = insertar(root.left, val);
    else root.right = insertar(root.right, val);

    return root;
}

function treeSort(arr) {
    let root = null;

    for (let v of arr) {
        root = insertar(root, v);
    }

    let result = [];

    function inorder(node) {
        if (!node) return;
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }

    inorder(root);
    return result;
}

/* medir */
async function medir() {

    for (let n of sizes) {

        let total = 0;

        for (let i = 0; i < 50; i++) { // menos repeticiones (es más pesado)

            let arr = generarArreglo(n);

            let inicio = performance.now();
            treeSort(arr);
            let fin = performance.now();

            total += (fin - inicio);
        }

        tiempos.push(total / 50);
    }

    graficar();
}

function graficar() {

    // 🔥 NORMALIZAR TIEMPOS
    let maxTiempo = Math.max(...tiempos);
    let tiemposNorm = tiempos.map(t => t / maxTiempo);

    // 🔥 FUNCIÓN TEÓRICA TreeSort ≈ n log n
    let teorico = sizes.map(n => n * Math.log2(n));
    let maxTeorico = Math.max(...teorico);
    let teoricoNorm = teorico.map(t => t / maxTeorico);

    new Chart(document.getElementById("chart"), {
        type: 'line',
        data: {
            labels: sizes,
            datasets: [
                {
                    label: 'TreeSort (normalizado)',
                    data: tiemposNorm,
                    tension: 0.3
                },
                {
                    label: 'T(n) ≈ n log n (normalizado)',
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

medir();