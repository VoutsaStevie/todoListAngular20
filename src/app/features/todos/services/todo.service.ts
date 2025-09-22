import { Injectable, signal, computed } from '@angular/core';
import { CreateTodoRequest, Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private currentUserId!: number;
  private todos = signal<Todo[]>([]);

  constructor() {
  const savedUserId = localStorage.getItem('currentUserId');
  if (savedUserId) {
    this.currentUserId = Number(savedUserId);
    // ⚡ Charger les todos de l'utilisateur directement
    this.todos.set(this.loadTodos(this.currentUserId));
  } else {
    // Optionnel : définir un utilisateur par défaut si aucun n'est connecté
    this.currentUserId = 1;
    this.todos.set(this.loadTodos(this.currentUserId));
  }
}

  // Définir l'utilisateur courant
  setCurrentUser(userId: number) {
    this.currentUserId = userId;
    localStorage.setItem('currentUserId', String(userId));
    this.todos.set(this.loadTodos(userId));
  }

  // Générer la clé unique pour chaque utilisateur
  private storageKey(userId: number) {
    return `todos_user_${userId}`;
  }

  // Charger les todos d'un utilisateur
  private loadTodos(userId: number): Todo[] {
    const saved = localStorage.getItem(this.storageKey(userId));
    return saved ? JSON.parse(saved) : [];
  }

  // Sauvegarder les todos de l'utilisateur courant
  private saveTodos() {
    if (!this.currentUserId) return;
    localStorage.setItem(this.storageKey(this.currentUserId), JSON.stringify(this.todos()));
  }

  // Computed properties
  public completedTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'done')
  );

  public pendingTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'todo')
  );

  public inProgressTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'in-progress')
  );

  public highPriorityTodos = computed(() =>
    this.todos().filter(todo => todo.priority === 'high')
  );

  public todoStats = computed(() => ({
    total: this.todos().length,
    completed: this.completedTodos().length,
    inProgress: this.inProgressTodos().length,
    pending: this.pendingTodos().length,
    highPriority: this.highPriorityTodos().length,
    completionRate: this.todos().length > 0
      ? (this.completedTodos().length / this.todos().length) * 100
      : 0
  }));

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET
  async getAllTodos(): Promise<Todo[]> {
    await this.delay(100);
    return this.todos();
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    await this.delay(50);
    return this.todos().find(t => t.id === id);
  }

  // POST
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    await this.delay(100);
    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: this.currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.update(todos => [...todos, newTodo]);
    this.saveTodos();
    return newTodo;
  }

  // PUT
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    await this.delay(50);
    let updatedTodo: Todo | undefined;
    this.todos.update(todos =>
      todos.map(todo => {
        if (todo.id === id) {
          updatedTodo = { ...todo, ...updates, updatedAt: new Date() };
          return updatedTodo;
        }
        return todo;
      })
    );
    this.saveTodos();
    return updatedTodo;
  }

  // DELETE
  async deleteTodo(id: number): Promise<boolean> {
    await this.delay(50);
    let deleted = false;
    this.todos.update(todos => {
      const filtered = todos.filter(todo => todo.id !== id);
      deleted = filtered.length < todos.length;
      return filtered;
    });
    this.saveTodos();
    return deleted;
  }

  // Filtres utils
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter(todo => todo.priority === priority);
  }
}
