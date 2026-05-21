import { Component } from '@angular/core';

@Component({
 selector: 'app-header',
 standalone: true,
 template: `
 <nav class="navbar navbar-dark bg-dark px-4">
   <span class="navbar-brand mb-0 h1">Smart Task Manager</span>
   <button class="btn btn-light" (click)="toggleTheme()">
     Toggle Theme
   </button>
 </nav>
 `
})
export class HeaderComponent {
 toggleTheme() {
   document.body.classList.toggle('dark-mode');
 }
}