import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
 selector:'app-task-list',
 standalone:true,
 imports:[CommonModule, FormsModule],
 templateUrl:'./task-list.html'
})
export class TaskListComponent {
 service = inject(TaskService);
    search = '';
    
}