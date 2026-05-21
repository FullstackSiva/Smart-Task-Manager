import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule
} from '@angular/cdk/drag-drop';
import {
  BaseChartDirective
} from 'ng2-charts';

import {
  ChartConfiguration,
  ChartType, Chart,
  registerables
} from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService }
  from './services/auth.service';
import { LoginComponent } from './login/login';
import {
  transferArrayItem
} from '@angular/cdk/drag-drop';
Chart.register(
  ...registerables
);
@Component({
  selector: 'app-root',
  standalone: true,
imports: [
CommonModule,
  FormsModule,
  DragDropModule,
  BaseChartDirective,
  LoginComponent
],
  templateUrl: './app.html',
  
  styleUrl: './app.css'
})
export class AppComponent {
dueDate = '';
toastMessage = '';
showToast = false;
showProfileMenu = false;
isDarkMode = false;
showTaskModal = false;
isEditing = false;
title = '';
description = '';
priority: 'High' | 'Medium' | 'Low' = 'Medium';
searchTerm = '';
filterStatus = 'All';
editingTaskId: number | null = null;
category:
  'Work'
  | 'Personal'
  | 'Learning'
  | 'Other'
    = 'Work';
pieChartType: ChartType = 'doughnut';
pieChartOptions:
ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
    legend: {
    position: 'bottom'
    }
  }
    };
  taskErrors = {
  title: '',
  description: '',
  dueDate: ''
  };
  selectedStatus:
  | 'All'
  | 'Pending'
  | 'In Progress'
  | 'Completed'
    = 'All';
  todayDate =
  new Date()
    .toISOString()
      .split('T')[0];
  isLoading = false;
validateTask() {

  this.taskErrors = {
    title: '',
    description: '',
    dueDate: ''
  };

  let isValid = true;

  if (!this.title.trim()) {

    this.taskErrors.title =
      'Task title is required';

    isValid = false;
  }

  if (
    this.description &&
    this.description.length < 10
  ) {

    this.taskErrors.description =
      'Description must be at least 10 characters';

    isValid = false;
  }

  if (!this.dueDate) {

    this.taskErrors.dueDate =
      'Due date is required';

    isValid = false;
  }

  return isValid;
}
showNotification(message: string) {
  this.toastMessage = message;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 2500);
}
addTask() {
if (!this.validateTask()) {
  return;
}
    if (!this.title.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: 'Pending',
      category: this.category,
      dueDate: this.dueDate,
      createdAt: new Date()
    };

    this.taskService.addTask(task);
    this.resetForm();
    this.showNotification(
  'Task Added Successfully'
    );
    
  }

editTask(task: Task) {

  this.isEditing = true;
  this.showTaskModal = true;

  this.editingTaskId =
    task.id;

  this.title =
    task.title;

  this.description =
    task.description;

  this.priority =
    task.priority;

  this.category =
    task.category || 'Work';

  this.dueDate =
    task.dueDate || '';
}

updateTask() {
 if (!this.validateTask()) {
  return;
}
    const task = this.taskService
      .tasks()
      .find(t => t.id === this.editingTaskId);

    if (!task) return;

    this.taskService.updateTask({
      ...task,
      title: this.title,
      description: this.description,
        dueDate: this.dueDate,
      priority: this.priority,
      category: this.category,
    });
    this.resetForm();
    this.showNotification(
  'Task Updated'
    );
    
  }
archiveTask(task: Task) {

  this.taskService.updateTask({
    ...task,
    isArchived: true
  });

  this.showNotification(
    'Task Archived'
  );
  }
  restoreTask(task: Task) {

  this.taskService.updateTask({
    ...task,
    isArchived: false
  });

  this.showNotification(
    'Task Restored'
  );
}
changeStatus(task: Task, status: any) {
    this.taskService.updateTask({
      ...task,
      status
    });
  }

deleteTask(id: number) {
    this.taskService.deleteTask(id);
    this.showNotification(
  'Task Deleted'
);
  }

  

 resetForm() {

  this.title = '';
  this.description = '';

  this.priority =
    'Medium';

  this.category =
    'Work';

  this.dueDate = '';

  this.editingTaskId =
    null;

  this.isEditing = false;

  this.showTaskModal =
    false;
}
  markAllCompleted() {

  this.taskService.tasks().forEach(task => {

    if (task.status !== 'Completed') {

      this.taskService.updateTask({
        ...task,
        status: 'Completed'
      });

    }
  });
  }
  drop(event: CdkDragDrop<any[]>) {

  const updatedTasks =
    [...this.filteredTasks];

  moveItemInArray(
    updatedTasks,
    event.previousIndex,
    event.currentIndex
  );

  this.taskService.tasks.set(
    updatedTasks
  );

  localStorage.setItem(
    'smart_tasks',
    JSON.stringify(updatedTasks)
  );

  this.showNotification(
    'Tasks Reordered'
  );
  }

  exportTasksToPDF() {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text(
    'Smart Task Manager Report',
    14,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    30
  );

  const tableData =
    this.taskService.tasks().map(task => [

      task.title,

      task.description || '-',

      task.priority,

      task.status,

      task.category || '-',

      task.dueDate || '-'
    ]);

  autoTable(doc, {
    head: [[
      'Title',
      'Description',
      'Priority',
      'Status',
      'Category',
      'Due Date'
    ]],

    body: tableData,

    startY: 40
  });

  doc.save('smart-tasks-report.pdf');

  this.showNotification(
    'PDF Exported Successfully'
  );
  }
  logout() {

  this.authService.logout();

  this.showNotification(
    'Logged Out'
  );
  }
  toggleProfileMenu() {
  this.showProfileMenu =
    !this.showProfileMenu;
  }
  toggleDarkMode() {

  this.isDarkMode =
    !this.isDarkMode;

  document.documentElement.classList.toggle(
    'dark-theme'
  );

  localStorage.setItem(
    'darkMode',
    JSON.stringify(this.isDarkMode)
  );
}
  openTaskModal() {

  this.resetForm();

  this.showTaskModal =
    true;
  }
  dropKanban(
  event: CdkDragDrop<any[]>,
  status:
    | 'Pending'
    | 'In Progress'
    | 'Completed'
) {

  const task =
    event.previousContainer.data[
      event.previousIndex
    ];

  this.taskService.updateTask({
    ...task,
    status
  });

  this.showNotification(
    `Moved to ${status}`
  );
  }
  deleteForever(id: number) {

  this.taskService.deleteTask(id);

  this.showNotification(
    'Task Deleted Forever'
  );
}
 get pieChartData() {

  const pending =
    this.taskService.tasks()
      .filter(
        t =>
          t.status ===
          'Pending'
      ).length;

  const inProgress =
    this.taskService.tasks()
      .filter(
        t =>
          t.status ===
          'In Progress'
      ).length;

  const completed =
    this.taskService.tasks()
      .filter(
        t =>
          t.status ===
          'Completed'
      ).length;

  return {
    labels: [
      'Pending',
      'In Progress',
      'Completed'
    ],

    datasets: [
      {
        data: [
          pending,
          inProgress,
          completed
        ],

        backgroundColor: [
          '#f59e0b',
          '#3b82f6',
          '#10b981'
        ],

        borderRadius: 10
      }
    ]
  };
}
get filteredTasks() {

  return this.taskService.tasks()
    .filter(
      task =>
        !task.isArchived
    )
    .filter(task => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            this.searchTerm
            .toLowerCase()
          );

      const matchesFilter =
        this.selectedStatus ===
        'All'
          ? true
          : task.status ===
            this.selectedStatus;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
}
  get pendingTasks() {
  return this.filteredTasks.filter(
    t => t.status === 'Pending'
  );
}

  get inProgressTasks() {
  return this.filteredTasks.filter(
    t =>
      t.status ===
      'In Progress'
  );
}

  get completedTasksList() {
  return this.filteredTasks.filter(
    t =>
      t.status ===
      'Completed'
  );
  }
  get groupedTasks() {

  const grouped:
  Record<string, any[]> = {};

  this.filteredTasks.forEach(task => {

    const date =
      task.dueDate ||
      'No Due Date';

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(task);
  });

  return Object.entries(grouped);
  }
  get overdueTasks() {

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  return this.filteredTasks.filter(
    task =>
      task.dueDate &&
      task.dueDate < today &&
      task.status !==
        'Completed'
  );
}

get dueTodayTasks() {

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  return this.filteredTasks.filter(
    task =>
      task.dueDate ===
      today
  );
}

get dueTomorrowTasks() {

  const tomorrow =
    new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const formatted =
    tomorrow
      .toISOString()
      .split('T')[0];

  return this.filteredTasks.filter(
    task =>
      task.dueDate ===
      formatted
  );
}
  constructor(
  public taskService: TaskService, public authService:
  AuthService
) {

  const savedTheme =
    localStorage.getItem('darkMode');

  if (savedTheme === 'true') {
    this.isDarkMode = true;
    document.body.classList.add(
      'dark-theme'
    );
    }
    setTimeout(() => {

    this.isLoading =
      false;

  }, 1200);

    
}
}