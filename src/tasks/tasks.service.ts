import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[]{
        const { status, search } = filterDTO;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search){
            tasks = tasks.filter(task => 
                task.title.includes(search) || task.description.includes(search));
        }

        return tasks;
    }

    createTask(createTaskDTO: CreateTaskDTO): Task {
        const { title, description } = createTaskDTO;

        const task: Task = {
            id : uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);

        return task;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id == id);
    }

    deleteTask(id: string): void{
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatus(id: string, newStatus: TaskStatus): Task{
        const task = this.getTaskById(id);

        task.status = newStatus;
        return task;
    }
}
