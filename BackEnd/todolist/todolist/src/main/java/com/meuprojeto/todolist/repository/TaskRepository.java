package com.meuprojeto.todolist.repository;

import com.meuprojeto.todolist.entitys.task.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    @Query("""
        SELECT t FROM Task t 
        ORDER BY 
            t.concluida ASC, 
            CASE 
                WHEN t.dataLimite < CURRENT_DATE AND t.concluida = false THEN 0 
                ELSE 1 
            END ASC,
            t.dataLimite ASC,
            CASE 
                WHEN t.prioridade = 'ALTA' THEN 0 
                WHEN t.prioridade = 'MEDIA' THEN 1 
                ELSE 2 
            END ASC
    """)
    Page<Task> findAllCustomSorted(Pageable pageable);

    @Query("""
        SELECT t FROM Task t 
        WHERE t.dataLimite = CURRENT_DATE
        ORDER BY 
            t.concluida ASC, 
            CASE 
                WHEN t.prioridade = 'ALTA' THEN 0 
                WHEN t.prioridade = 'MEDIA' THEN 1 
                ELSE 2 
            END ASC,
            t.titulo ASC
    """)
    Page<Task> findAllToday(Pageable pageable);

    @Query("""
        SELECT t FROM Task t 
        WHERE (:name IS NULL OR :name = '' OR LOWER(t.titulo) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:apenasHoje = false OR t.dataLimite = :dataAtual)
        AND (CAST(:dataFiltro AS localdate) IS NULL OR t.dataLimite = :dataFiltro)
        AND (
            LOWER(:statusFiltro) = 'todas as tarefas' 
            OR (LOWER(:statusFiltro) = 'ativas' AND t.concluida = false)
            OR (LOWER(:statusFiltro) = 'concluídas' AND t.concluida = true)
            OR (LOWER(:statusFiltro) = 'prioridades' AND t.prioridade = 'ALTA')
        )
        ORDER BY 
            t.concluida ASC, 
            CASE 
                WHEN t.dataLimite < :dataAtual AND t.concluida = false THEN 0 
                ELSE 1 
            END ASC,
            t.dataLimite ASC,
            CASE 
                WHEN t.prioridade = 'ALTA' THEN 0 
                WHEN t.prioridade = 'MEDIA' THEN 1 
                ELSE 2 
            END ASC
    """)
    Page<Task> searchByNameAndFilter(
            Pageable pageable,
            @Param("name") String name,
            @Param("statusFiltro") String statusFiltro,
            @Param("apenasHoje") boolean apenasHoje,
            @Param("dataFiltro") LocalDate dataFiltro,
            @Param("dataAtual") LocalDate dataAtual
    );

    void deleteByConcluidaTrue();

    long count();
    long countByConcluidaFalse();
    long countByConcluidaTrue();

    @Query("SELECT COUNT(t) FROM Task t WHERE t.concluida = false AND t.dataLimite < CURRENT_DATE")
    long countAtrasadas();
}