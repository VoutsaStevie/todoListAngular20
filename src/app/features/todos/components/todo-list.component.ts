// src/app/features/todos/components/todo-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, HighlightDirective],
  template: `
    <!-- Formulaire d'ajout -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Ajouter une tâche</h2>
      <form (ngSubmit)="onAddTodo()" #todoForm="ngForm" class="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          [(ngModel)]="newTodoTitle"
          name="title"
          required
          placeholder="Titre"
          class="flex-1 px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          [(ngModel)]="newTodoDescription"
          name="description"
          placeholder="Description"
          class="flex-1 px-3 py-2 border rounded-md"
        />
        <select
          [(ngModel)]="newTodoPriority"
          name="priority"
          class="px-3 py-2 border rounded-md"
        >
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
        <button
          type="submit"
          [disabled]="!todoForm.form.valid"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>
    </div>

    <!-- Dashboard des statistiques -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Statistiques en temps réel</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Total</h3>
          <p class="text-2xl font-bold text-gray-900">{{ todoService.todoStats().total }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Complétés</h3>
          <p class="text-2xl font-bold text-green-600">{{ todoService.todoStats().completed }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">En cours</h3>
          <p class="text-2xl font-bold text-blue-600">{{ todoService.todoStats().inProgress }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Priorité haute</h3>
          <p class="text-2xl font-bold text-red-600">{{ todoService.todoStats().highPriority }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Taux de complétion</h3>
          <p class="text-2xl font-bold text-purple-600">
            {{ todoService.todoStats().completionRate | number:'1.0-0' }}%
          </p>
        </div>
      </div>
    </div>

    <!-- Colonnes Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- À faire -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          À faire
          <span class="text-sm text-gray-500">({{ todoService.pendingTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.pendingTodos(); track todo.id) {
            <div
              class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400"
              [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
              [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  [class.bg-red-100]="todo.priority === 'high'"
                  [class.text-red-800]="todo.priority === 'high'"
                  [class.bg-yellow-100]="todo.priority === 'medium'"
                  [class.text-yellow-800]="todo.priority === 'medium'"
                  [class.bg-green-100]="todo.priority === 'low'"
                  [class.text-green-800]="todo.priority === 'low'"
                >
                  {{ todo.priority | priority }}
                </span>
              </div>
              @if (todo.description) {
                <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
              }
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Créé le {{ todo.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- En cours -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          En cours
          <span class="text-sm text-gray-500">({{ todoService.inProgressTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.inProgressTodos(); track todo.id) {
            <div
              class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400"
              [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
              [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  [class.bg-red-100]="todo.priority === 'high'"
                  [class.text-red-800]="todo.priority === 'high'"
                  [class.bg-yellow-100]="todo.priority === 'medium'"
                  [class.text-yellow-800]="todo.priority === 'medium'"
                  [class.bg-green-100]="todo.priority === 'low'"
                  [class.text-green-800]="todo.priority === 'low'"
                >
                  {{ todo.priority | priority }}
                </span>
              </div>
              @if (todo.description) {
                <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
              }
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Mis à jour le {{ todo.updatedAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Terminé -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Terminé
          <span class="text-sm text-gray-500">({{ todoService.completedTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.completedTodos(); track todo.id) {
            <div
              class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400"
              [appHighlight]="todo.priority === 'high' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'"
              [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900 line-through">{{ todo.title }}</h4>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  [class.bg-red-100]="todo.priority === 'high'"
                  [class.text-red-800]="todo.priority === 'high'"
                  [class.bg-yellow-100]="todo.priority === 'medium'"
                  [class.text-yellow-800]="todo.priority === 'medium'"
                  [class.bg-green-100]="todo.priority === 'low'"
                  [class.text-green-800]="todo.priority === 'low'"
                >
                  {{ todo.priority | priority }}
                </span>
              </div>
              @if (todo.description) {
                <p class="text-sm text-gray-600 mb-3 line-through">{{ todo.description }}</p>
              }
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Terminé le {{ todo.updatedAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TodoListComponent {
  todoService = inject(TodoService);

  // ✅ Ajout des variables pour le formulaire
  newTodoTitle = '';
  newTodoDescription = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';

  async onAddTodo() {
    if (!this.newTodoTitle.trim()) return;
    await this.todoService.createTodo({
      title: this.newTodoTitle,
      description: this.newTodoDescription,
      priority: 'medium',
    });
    this.newTodoTitle = '';
  }
}