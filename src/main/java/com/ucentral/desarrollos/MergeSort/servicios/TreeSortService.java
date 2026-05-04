package com.ucentral.desarrollos.MergeSort.servicios;

import com.ucentral.desarrollos.MergeSort.modelos.Step;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TreeSortService {

    private List<Step> steps = new ArrayList<>();

    public List<Step> generarPasos(List<Integer> datos) {

        steps.clear();

        Node root = null;

        // insertar
        for (Integer val : datos) {
            root = insert(root, val);
        }

        // recorrido inorder
        List<Integer> resultado = new ArrayList<>();
        inOrder(root, resultado);

        return steps;
    }

    /* ========================
       NODO
    ======================== */
    class Node {
        int value;
        Node left, right;

        Node(int value) {
            this.value = value;
        }
    }

    /* ========================
       INSERT
    ======================== */
    private Node insert(Node node, int value) {

        if (node == null) {
            steps.add(new Step("insert", value,
                    "Insertar " + value + " como nodo"));
            return new Node(value);
        }

        if (value < node.value) {
            steps.add(new Step("insert", value,
                    "Ir a la izquierda de " + node.value));
            node.left = insert(node.left, value);
        } else {
            steps.add(new Step("insert", value,
                    "Ir a la derecha de " + node.value));
            node.right = insert(node.right, value);
        }

        return node;
    }

    /* ========================
       INORDER
    ======================== */
    private void inOrder(Node node, List<Integer> resultado) {

        if (node == null) return;

        inOrder(node.left, resultado);

        resultado.add(node.value);

        steps.add(new Step(
                "visit",
                node.value,
                new ArrayList<>(resultado),
                "Visitar " + node.value + " → parcial: " + resultado
        ));

        inOrder(node.right, resultado);
    }
}