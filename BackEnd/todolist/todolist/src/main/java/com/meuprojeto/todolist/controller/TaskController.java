package com.meuprojeto.todolist.controller;

import com.meuprojeto.todolist.entitys.task.Task;
import com.meuprojeto.todolist.entitys.task.TaskRequestDTO;
import com.meuprojeto.todolist.entitys.task.TaskResponseDTO;
import com.meuprojeto.todolist.service.TaskService;
import jakarta.validation.Valid;
import org.hibernate.sql.model.ast.builder.TableUpdateBuilderSkipped;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> saveTask(@RequestBody @Valid TaskRequestDTO taskDTO){
        Task task = taskService.saveTask(taskDTO);
        TaskResponseDTO response = new TaskResponseDTO(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> taskList(){
        List<Task> tasks = taskService.taskList();
        List<TaskResponseDTO> response = tasks.stream().map(TaskResponseDTO::new).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today")
    public ResponseEntity<List<TaskResponseDTO>> taskListToday(){
        List<Task> tasks = taskService.taskListToday();
        List<TaskResponseDTO> response = tasks.stream().map(TaskResponseDTO::new).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponseDTO>> searchByName(@RequestParam(required = false) String name){
        List<Task> tasks = taskService.searchByName(name);
        List<TaskResponseDTO> response = tasks.stream().map(TaskResponseDTO::new).toList();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@RequestBody @Valid TaskRequestDTO taskDTO,@PathVariable UUID id){
        Task task = taskService.updateTask(taskDTO,id);
        TaskResponseDTO response = new TaskResponseDTO(task);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteTask(@PathVariable UUID id){
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
