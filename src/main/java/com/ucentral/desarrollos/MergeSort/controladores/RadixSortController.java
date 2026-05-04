package com.ucentral.desarrollos.MergeSort.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RadixSortController {

    @GetMapping("/radixsort")
    public String verPagina() {
        return "radixsort";
    }

    @GetMapping("/radixsort/grafica")
    public String verGrafica() {
        return "radixsortGrafica";
    }
}
