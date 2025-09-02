import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { TodoListComponent } from './features/todos/components/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, TodoListComponent],
  template: `
    <app-header></app-header>
    <app-todo-list></app-todo-list>
    <main class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class App {
  title = 'todo-list-app';
}