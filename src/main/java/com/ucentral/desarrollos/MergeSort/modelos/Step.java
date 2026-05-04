package com.ucentral.desarrollos.MergeSort.modelos;

import java.util.List;

public class Step {

    private String tipo;
    private int valor;
    private List<Integer> resultado;
    private String mensaje;

    public Step() {}

    // constructor insert
    public Step(String tipo, int valor, String mensaje) {
        this.tipo = tipo;
        this.valor = valor;
        this.mensaje = mensaje;
    }

    // constructor visit
    public Step(String tipo, int valor, List<Integer> resultado, String mensaje) {
        this.tipo = tipo;
        this.valor = valor;
        this.resultado = resultado;
        this.mensaje = mensaje;
    }

    // getters y setters
    public String getTipo() { return tipo; }
    public int getValor() { return valor; }
    public List<Integer> getResultado() { return resultado; }
    public String getMensaje() { return mensaje; }

    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setValor(int valor) { this.valor = valor; }
    public void setResultado(List<Integer> resultado) { this.resultado = resultado; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}