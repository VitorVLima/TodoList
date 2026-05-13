package com.meuprojeto.todolist.controller;

import com.meuprojeto.todolist.entitys.task.Task;
import com.meuprojeto.todolist.service.TaskService;
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
    public ResponseEntity<Task> saveTask(@RequestBody Task task){
        return ResponseEntity.ok(taskService.saveTask(task));
    }

    @GetMapping
    public ResponseEntity<List<Task>> taskList(){
        List<Task> tasks = taskService.taskList();

        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@RequestBody Task task,@PathVariable UUID id){
        return ResponseEntity.ok(taskService.updateTask(task,id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteTask(@PathVariable UUID id){
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
