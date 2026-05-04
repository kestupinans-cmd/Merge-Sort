package com.ucentral.desarrollos.MergeSort.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TreeSortGraficaController {

    @GetMapping("/treesort/grafica")
    public String verGrafica() {
        return "treesortgrafica";
    }
}