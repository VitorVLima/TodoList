package com.meuprojeto.todolist.entitys.task;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record TaskRequestDTO(

        @NotBlank(message = "Campo de titulo está vazio")
        String titulo,

        @NotBlank(message = "Campo de descrição está vazio")
        String descricao,

        @NotBlank(message = "Escolha o nível de prioridade da tarefa")
        @Pattern(regexp = "ALTA|MEDIA|BAIXA", message = "Prioridade inválida")
        String prioridade,

        @NotNull(message = "A tarefa deve ter uma data limite")
        LocalDate dataLimite,

        Boolean concluida
        ) {
}
