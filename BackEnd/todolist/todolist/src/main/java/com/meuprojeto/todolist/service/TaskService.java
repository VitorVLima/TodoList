package com.meuprojeto.todolist.service;

import com.meuprojeto.todolist.entitys.task.Task;
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
    public Task saveTask(Task task){
        task.setConcluida(false);
        return taskRepository.save(task);
    }

    public List<Task> taskList(){
        List<Task> tasks =  taskRepository.findAll();
        tasks.forEach(task -> {
            task.ajustarPrioridadePorAtraso();
            taskRepository.save(task);
        });
        return tasks;
    }

    @Transactional
    public Task updateTask(Task task, UUID id) {
        Task taskExistente = taskRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Tarefa Não Existe")
        );

        taskExistente.setTitulo(task.getTitulo());
        taskExistente.setDescricao(task.getDescricao());
        taskExistente.setPrioridade(task.getPrioridade());
        taskExistente.setDataLimite(task.getDataLimite());
        taskExistente.setConcluida(task.getConcluida());

        return taskRepository.save(taskExistente);
    }

    @Transactional
    public void deleteTask(UUID id){
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Tarefa Não Existe");
        }
        taskRepository.deleteById(id);
    }
}