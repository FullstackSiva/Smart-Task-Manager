import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
 selector:'app-task-form',
 standalone:true,
 imports:[CommonModule, FormsModule],
 templateUrl:'./task-form.html'
})
export class TaskFormComponent {
 service = inject(TaskService);

 title='';
 description='';
 priority='Medium';

 addTask(){
  if(!this.title.trim()) return;

  this.service.addTask({
   id: Date.now(),
   title:this.title,
   description:this.description,
   priority:this.priority as any,
   status:'Pending',
   createdAt:new Date()
  });

  this.title='';
  this.description='';
 }
}