import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async createTask(
        createTaskDTO: CreateTaskDTO, 
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: {id, userId: user.id}});

        if (!found) {
            throw new NotFoundException(`Task com id ${id} não encontrado.`);
        }

        return found;
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Task com id ${id} não encontrado.`);
        }
    }

    async updateTaskStatus(
        id: number, 
        status: TaskStatus,
        user: User
    ): Promise<Task>{
        const task = await this.getTaskById(id, user);

        task.status = status;
        await task.save();

        return task;
    }

    async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }
}
