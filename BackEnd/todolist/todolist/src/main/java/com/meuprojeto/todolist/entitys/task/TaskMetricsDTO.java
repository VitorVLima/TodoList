package com.meuprojeto.todolist.entitys.task;

public record TaskMetricsDTO(
        long total,
        long pendentes,
        long concluidas,
        long atrasadas,
        int porcentagem
) {
}
