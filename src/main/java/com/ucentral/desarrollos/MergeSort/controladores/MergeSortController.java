package com.ucentral.desarrollos.MergeSort.controladores;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class MergeSortController {

    @PostMapping("/mergesort")
    public List<Map<String, Object>> mergeSortSteps(@RequestBody List<Integer> input) {
        List<Map<String, Object>> steps = new ArrayList<>();
        mergeSort(input, 0, input.size() - 1, steps);
        return steps;
    }

    private void mergeSort(List<Integer> arr, int left, int right, List<Map<String, Object>> steps) {

        if (left < right) {

            int mid = left + (right - left + 1) / 2 - 1;

            steps.add(eventDivide(arr, left, mid, right));

            mergeSort(arr, left, mid, steps);
            mergeSort(arr, mid + 1, right, steps);

            merge(arr, left, mid, right, steps);
        }
    }

    private void merge(List<Integer> arr, int left, int mid, int right, List<Map<String, Object>> steps) {

        List<Integer> leftArr = new ArrayList<>(arr.subList(left, mid + 1));
        List<Integer> rightArr = new ArrayList<>(arr.subList(mid + 1, right + 1));

        List<Integer> temp = new ArrayList<>();

        int i = 0, j = 0;

        while (i < leftArr.size() && j < rightArr.size()) {

            if (leftArr.get(i) <= rightArr.get(j)) {
                temp.add(leftArr.get(i++));
            } else {
                temp.add(rightArr.get(j++));
            }

            steps.add(eventMerge(leftArr, rightArr, temp,
                    "Resultado parcial: " + temp,
                    left, right));
        }

        while (i < leftArr.size()) temp.add(leftArr.get(i++));
        while (j < rightArr.size()) temp.add(rightArr.get(j++));

        for (int k = 0; k < temp.size(); k++) {
            arr.set(left + k, temp.get(k));
        }

        steps.add(eventMerge(leftArr, rightArr, temp,
                "Subarreglo ordenado: " + temp,
                left, right));
    }

    private Map<String, Object> eventDivide(List<Integer> arr, int left, int mid, int right) {

        Map<String, Object> e = new HashMap<>();

        e.put("tipo", "DIVIDIR");
        e.put("izquierda", new ArrayList<>(arr.subList(left, mid + 1)));
        e.put("derecha", new ArrayList<>(arr.subList(mid + 1, right + 1)));
        e.put("leftIndex", left);
        e.put("rightIndex", right);
        e.put("mensaje", "Dividiendo");

        return e;
    }

    private Map<String, Object> eventMerge(List<Integer> left,
                                           List<Integer> right,
                                           List<Integer> result,
                                           String msg,
                                           int leftIndex,
                                           int rightIndex) {

        Map<String, Object> e = new HashMap<>();

        e.put("tipo", "MERGE");
        e.put("izquierda", left);
        e.put("derecha", right);
        e.put("resultado", result);
        e.put("leftIndex", leftIndex);
        e.put("rightIndex", rightIndex);
        e.put("mensaje", msg);

        return e;
    }

}