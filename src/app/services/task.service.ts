import {
  Injectable,
  signal,
  computed
} from '@angular/core';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private storageKey = 'smart_tasks';

  tasks = signal<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  totalTasks = computed(() =>
    this.tasks().length
  );

  completedTasks = computed(() =>
    this.tasks().filter(
      task => task.status === 'Completed'
    ).length
  );

  pendingTasks = computed(() =>
    this.tasks().filter(
      task => task.status !== 'Completed'
    ).length
  );

  addTask(task: Task) {
    this.tasks.update(tasks => [
      ...tasks,
      task
    ]);

    this.saveTasks();
  }

  updateTask(updatedTask: Task) {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );

    this.saveTasks();
  }

  deleteTask(id: number) {
    this.tasks.update(tasks =>
      tasks.filter(
        task => task.id !== id
      )
    );

    this.saveTasks();
  }

  private saveTasks() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.tasks())
    );
  }

  private loadTasks() {
    const data =
      localStorage.getItem(this.storageKey);

    if (data) {
      this.tasks.set(JSON.parse(data));
    }
  }
}