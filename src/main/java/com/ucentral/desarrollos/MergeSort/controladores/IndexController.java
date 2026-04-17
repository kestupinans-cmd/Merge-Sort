package com.ucentral.desarrollos.MergeSort.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/")
    public String index() {
        return "explicacion";
    }

    @GetMapping("/grafica")
    public String grafica(){
        return "grafica";
    }
}
