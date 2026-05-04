package com.ucentral.desarrollos.MergeSort.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TreeSortController {

    @GetMapping("/treesort")
    public String verPagina() {
        return "treesort";
    }
}