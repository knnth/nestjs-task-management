import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[]{
    //     const { status, search } = filterDTO;
    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if (search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) || task.description.includes(search));
    //     }

    //     return tasks;
    // }

    async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const { title, description } = createTaskDTO;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task com id ${id} não encontrado.`);
        }

        return found;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task com id ${id} não encontrado.`);
        }
        // return result;
    }

    // updateTaskStatus(id: string, status: TaskStatus): Task{
    //     const task = this.getTaskById(id);

    //     task.status = status;
    //     return task;
    // }
}
