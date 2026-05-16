package com.meuprojeto.todolist.service;

import com.meuprojeto.todolist.entitys.task.Task;
import com.meuprojeto.todolist.entitys.task.TaskRequestDTO;
import com.meuprojeto.todolist.exceptions.RecursoNaoEncontradoException;
import com.meuprojeto.todolist.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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

    public List<Task> taskList(){
        List<Task> tasks =  taskRepository.findAllCustomSorted();
        tasks.forEach(task -> {
            task.ajustarPrioridadePorAtraso();
            taskRepository.save(task);
        });
        return tasks;
    }

    public List<Task> taskListToday(){
        List<Task> tasks =  taskRepository.findAllToday();
        tasks.forEach(task -> {
            task.ajustarPrioridadePorAtraso();
            taskRepository.save(task);
        });
        return tasks;
    }

    public List<Task> searchByName(String name){
        List<Task> tasks = taskRepository.searchByName(name);
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
}