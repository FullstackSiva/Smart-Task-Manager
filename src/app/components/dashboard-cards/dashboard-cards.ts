import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
 selector: 'app-dashboard-cards',
 standalone: true,
 imports:[CommonModule],
 template: `
 <div class="row g-3 mb-4">
  <div class="col-md-4">
   <div class="card shadow-sm p-3">
    <h5>Total</h5>
    <h2>{{service.totalTasks()}}</h2>
   </div>
  </div>
  <div class="col-md-4">
   <div class="card shadow-sm p-3">
    <h5>Pending</h5>
    <h2>{{service.pendingTasks()}}</h2>
   </div>
  </div>
  <div class="col-md-4">
   <div class="card shadow-sm p-3">
    <h5>Completed</h5>
    <h2>{{service.completedTasks()}}</h2>
   </div>
  </div>
 </div>
 `
})
export class DashboardCardsComponent {
 service = inject(TaskService);
}