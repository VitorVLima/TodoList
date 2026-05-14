package com.meuprojeto.todolist.entitys.task;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "tarefas")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String titulo;

    private String descricao;

    private String prioridade;

    private Boolean concluida = false;

    private LocalDate dataLimite;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDate dataCriacao;

    @PrePersist
    @PreUpdate
    public void ajustarPrioridadePorAtraso() {
        if (this.dataLimite != null && this.dataLimite.isBefore(LocalDate.now()) && !this.concluida) {
            this.prioridade = "ALTA";
        }
    }

    @Transient
    public String getStatusCustomizado() {
        if (this.concluida) return "CONCLUIDA";
        if (this.dataLimite != null && this.dataLimite.isBefore(LocalDate.now())) return "ATRASADA";
        return "ATIVA";
    }
}
