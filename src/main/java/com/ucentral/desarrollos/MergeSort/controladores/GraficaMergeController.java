package com.ucentral.desarrollos.MergeSort.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

@Controller
public class GraficaMergeController {
    
    @GetMapping("/grafica-data")
    @ResponseBody
    public Map<Integer, Double> generarDatos() {

        Map<Integer, List<Long>> tiempos = new HashMap<>();
        Random rand = new Random();

        // inicializar tamaños
        for (int size = 1000; size <= 10000; size += 1000) {
            tiempos.put(size, new ArrayList<>());
        }

        // 1000 ejecuciones
        for (int i = 0; i < 1000; i++) {

            int size = (rand.nextInt(10) + 1) * 1000;

            List<Integer> arr = new ArrayList<>();
            for (int j = 0; j < size; j++) {
                arr.add(rand.nextInt(10000));
            }

            long inicio = System.nanoTime();

            mergeSortSimple(arr);

            long fin = System.nanoTime();

            tiempos.get(size).add(fin - inicio);
        }

        // promedios
        Map<Integer, Double> promedios = new TreeMap<>();

        for (int size : tiempos.keySet()) {

            List<Long> lista = tiempos.get(size);

            double promedio = lista.stream()
                    .mapToLong(Long::longValue)
                    .average()
                    .orElse(0);

            promedios.put(size, promedio / 1_000_000.0); // ms
        }

        return promedios;
    }
    private void mergeSortSimple(List<Integer> arr) {
        if (arr.size() <= 1) return;

        int mid = arr.size() / 2;

        List<Integer> left = new ArrayList<>(arr.subList(0, mid));
        List<Integer> right = new ArrayList<>(arr.subList(mid, arr.size()));

        mergeSortSimple(left);
        mergeSortSimple(right);

        arr.clear();

        int i = 0, j = 0;

        while (i < left.size() && j < right.size()) {
            if (left.get(i) < right.get(j)) {
                arr.add(left.get(i++));
            } else {
                arr.add(right.get(j++));
            }
        }

        while (i < left.size()) arr.add(left.get(i++));
        while (j < right.size()) arr.add(right.get(j++));
    }
}
