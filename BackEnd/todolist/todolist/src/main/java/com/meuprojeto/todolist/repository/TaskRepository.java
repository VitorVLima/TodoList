package com.meuprojeto.todolist.repository;

import com.meuprojeto.todolist.entitys.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    // Mantivemos sua lógica poderosa de ordenação
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
    List<Task> findAllCustomSorted(); // Mudei o nome para evitar conflito com o findAll padrão

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
    List<Task> findAllToday();

    @Query("""
        SELECT t FROM Task t 
        WHERE (:name IS NULL OR :name = '' OR LOWER(t.titulo) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (
            LOWER(:statusFiltro) = 'todas as tarefas' 
            OR (LOWER(:statusFiltro) = 'ativas' AND t.concluida = false)
            OR (LOWER(:statusFiltro) = 'concluídas' AND t.concluida = true)
            OR (LOWER(:statusFiltro) = 'prioridades' AND t.prioridade = 'ALTA')
        )
    """)
    List<Task> searchByNameAndFilter(
            @Param("name") String name,
            @Param("statusFiltro") String statusFiltro
    );

    void deleteByConcluidaTrue();
}