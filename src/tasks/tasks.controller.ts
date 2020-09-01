import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService){}

    // @Get()
    // getTasks(@Query(ValidationPipe) filterDTO: GetTasksFilterDTO): Task[] {
    //     if (Object.keys(filterDTO).length){
    //         return this.taskService.getTasksWithFilters(filterDTO);
    //     }else{
    //         return this.taskService.getAllTasks();
    //     }
    // }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task>{
        return this.taskService.createTask(createTaskDTO);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.taskService.deleteTask(id);
    }

    // @Patch('/:id/status')
    // updateTaskStatus(
    //     @Param('id') id: string,
    //     @Body('status', new TaskStatusValidationPipe()) status: TaskStatus,
    // ): Task {
    //     return this.taskService.updateTaskStatus(id, status);
    // }
}
