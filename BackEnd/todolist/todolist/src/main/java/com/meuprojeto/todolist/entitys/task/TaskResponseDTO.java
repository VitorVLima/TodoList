package com.meuprojeto.todolist.entitys.task;

import java.time.LocalDate;
import java.util.UUID;

public record TaskResponseDTO(
        UUID id,
        String titulo,
        String descricao,
        String prioridade,
        boolean concluida,
        LocalDate dataLimite,
        LocalDate dataCriacao,
        String statusCustomizado
) {
    public TaskResponseDTO(Task task){
        this(
                task.getId(),
                task.getTitulo(),
                task.getDescricao(),
                task.getPrioridade(),
                task.isConcluida(),
                task.getDataLimite(),
                task.getDataCriacao(),
                task.getStatusCustomizado()
        );
    }
}
