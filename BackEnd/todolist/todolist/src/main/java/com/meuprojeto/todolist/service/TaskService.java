package com.meuprojeto.todolist.service;

import com.meuprojeto.todolist.entitys.task.Task;
import com.meuprojeto.todolist.entitys.task.TaskMetricsDTO;
import com.meuprojeto.todolist.entitys.task.TaskRequestDTO;
import com.meuprojeto.todolist.exceptions.RecursoNaoEncontradoException;
import com.meuprojeto.todolist.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    @Transactional
    public Task saveTask(TaskRequestDTO taskDTO){
        Task task = Task.builder()
                .titulo(taskDTO.titulo())
                .descricao(taskDTO.descricao())
                .prioridade(taskDTO.prioridade())
                .dataLimite(taskDTO.dataLimite())
                .build();
        return taskRepository.save(task);
    }

    public Page<Task> taskList(Pageable pageable){
        Page<Task> tasks =  taskRepository.findAllCustomSorted(pageable);
        tasks.forEach(task -> {
            task.ajustarPrioridadePorAtraso();
            taskRepository.save(task);
        });
        return tasks;
    }

    public Page<Task> taskListToday(Pageable pageable){
        Page<Task> tasks =  taskRepository.findAllToday(pageable);
        tasks.forEach(task -> {
            task.ajustarPrioridadePorAtraso();
            taskRepository.save(task);
        });
        return tasks;
    }

    public Page<Task> searchByName(Pageable pageable, String name, String statusFiltro, boolean hoje, String dataFiltroStr){
        LocalDate dataFiltro = (dataFiltroStr != null && !dataFiltroStr.isEmpty()) ? LocalDate.parse(dataFiltroStr) : null;
        LocalDate dataAtual = LocalDate.now(); // <-- Data atual do sistema controlada pelo Java

        // Adicionado dataAtual no final
        Page<Task> tasks = taskRepository.searchByNameAndFilter(pageable, name, statusFiltro, hoje, dataFiltro, dataAtual);

        tasks.forEach(task -> {
            task.ajustarPrioridadePorAtraso();
            taskRepository.save(task);
        });
        return tasks;
    }

    @Transactional
    public Task updateTask(TaskRequestDTO taskDTO, UUID id) {
        Task taskExistente = taskRepository.findById(id).orElseThrow(
                () -> new RecursoNaoEncontradoException("Tarefa Não encontrada no banco de dados")
        );

        taskExistente.setTitulo(taskDTO.titulo());
        taskExistente.setDescricao(taskDTO.descricao());
        taskExistente.setPrioridade(taskDTO.prioridade());
        taskExistente.setDataLimite(taskDTO.dataLimite());
        taskExistente.setConcluida(taskDTO.concluida());

        return taskRepository.save(taskExistente);
    }

    @Transactional
    public void deleteTask(UUID id){
        if (!taskRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Tarefa Não Existe");
        }
        taskRepository.deleteById(id);
    }

    @Modifying
    @Transactional
    public void deleteAllTasksConcluidas(){
        taskRepository.deleteByConcluidaTrue();
    }

    public TaskMetricsDTO getMetricsDynamic(String name, String statusFiltro, boolean hoje, String dataFiltroStr) {
        LocalDate dataFiltro = (dataFiltroStr != null && !dataFiltroStr.isEmpty()) ? LocalDate.parse(dataFiltroStr) : null;
        LocalDate dataAtual = LocalDate.now(); // <-- Data atual do sistema controlada pelo Java

        // Adicionado dataAtual no final
        Page<Task> allFilteredTasks = taskRepository.searchByNameAndFilter(Pageable.unpaged(), name, statusFiltro, hoje, dataFiltro, dataAtual);
        List<Task> list = allFilteredTasks.getContent();

        long total = list.size();
        long concluidas = list.stream().filter(Task::isConcluida).count();
        long pendentes = total - concluidas;

        long atrasadas = list.stream().filter(t -> !t.isConcluida() && t.getDataLimite() != null && t.getDataLimite().isBefore(dataAtual)).count();

        int porcentagem = total > 0 ? (int) Math.round(((double) concluidas / total) * 100) : 0;

        return new TaskMetricsDTO(total, pendentes, concluidas, atrasadas, porcentagem);
    }
}