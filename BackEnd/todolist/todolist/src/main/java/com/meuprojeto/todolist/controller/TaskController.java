package com.meuprojeto.todolist.controller;

import com.meuprojeto.todolist.entitys.task.Task;
import com.meuprojeto.todolist.entitys.task.TaskMetricsDTO;
import com.meuprojeto.todolist.entitys.task.TaskRequestDTO;
import com.meuprojeto.todolist.entitys.task.TaskResponseDTO;
import com.meuprojeto.todolist.service.TaskService;
import jakarta.validation.Valid;
import org.hibernate.sql.model.ast.builder.TableUpdateBuilderSkipped;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
    public ResponseEntity<Page<TaskResponseDTO>> taskList(@PageableDefault(size = 10, page = 0)Pageable pageable){
        Page<Task> tasks = taskService.taskList(pageable);
        Page<TaskResponseDTO> response = tasks.map(TaskResponseDTO::new);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today")
    public ResponseEntity<Page<TaskResponseDTO>> taskListToday(@PageableDefault(size = 10, page = 0)Pageable pageable){
        Page<Task> tasks = taskService.taskListToday(pageable);
        Page<TaskResponseDTO> response = tasks.map(TaskResponseDTO::new);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TaskResponseDTO>> searchByName(
            @PageableDefault(size = 10, page = 0) Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(value = "statusFiltro", defaultValue = "Todas as Tarefas") String statusFiltro,
            @RequestParam(value = "hoje", defaultValue = "false") boolean hoje,
            @RequestParam(required = false) String dataFiltro) {

        Page<Task> tasks = taskService.searchByName(pageable, name, statusFiltro, hoje, dataFiltro); // O controller continua igual, o service mudou internamente
        Page<TaskResponseDTO> response = tasks.map(TaskResponseDTO::new);
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

    @DeleteMapping("/clear-concluidas")
    public ResponseEntity deleteTaskConcluidas(){
        taskService.deleteAllTasksConcluidas();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/metrics")
    public ResponseEntity<TaskMetricsDTO> getMetrics(
            @RequestParam(required = false) String name,
            @RequestParam(value = "statusFiltro", defaultValue = "Todas as Tarefas") String statusFiltro,
            @RequestParam(value = "hoje", defaultValue = "false") boolean hoje,
            @RequestParam(required = false) String dataFiltro) {

        TaskMetricsDTO metrics = taskService.getMetricsDynamic(name, statusFiltro, hoje, dataFiltro);
        return ResponseEntity.ok(metrics);
    }
}
