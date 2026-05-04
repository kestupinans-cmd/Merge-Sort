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

    const ctx = document.getElementById('chart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sizes,
            datasets: [
                {
                    label: 'Tiempo promedio (ms)',
                    data: tiempos,
                    borderWidth: 2
                },
                {
                    label: 'n log(n)',
                    data: sizes.map(n => n * Math.log2(n) / 1000),
                    borderDash: [5,5]
                },
                {
                    label: 'n²',
                    data: sizes.map(n => (n*n)/1000000),
                    borderDash: [2,2]
                }
            ]
        }
    });
}

medir();