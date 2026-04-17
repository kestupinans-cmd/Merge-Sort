async function cargarGrafica() {

    const res = await fetch("/grafica-data");
    const data = await res.json();

    const tamaños = Object.keys(data);
    const tiempos = Object.values(data);

    // T(n) = n log n
    const teorico = tamaños.map(n => n * Math.log2(n));

    // normalizar
    const maxReal = Math.max(...tiempos);
    const maxTeo = Math.max(...teorico);

    const teoricoNormalizado = teorico.map(v => v * (maxReal / maxTeo));

    new Chart(document.getElementById("chart"), {
        type: 'line',
        data: {
            labels: tamaños,
            datasets: [
                {
                    label: 'Tiempo promedio (ms)',
                    data: tiempos,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: 'T(n) = n log n',
                    data: teoricoNormalizado,
                    borderDash: [5,5],
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

cargarGrafica();