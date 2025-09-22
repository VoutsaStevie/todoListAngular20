import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { CreateTodoRequest } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a todo', async () => {
    const todoData: CreateTodoRequest = {
      title: 'Test Todo',
      description: 'Just a test',
      priority: 'low',
      assignedTo: 1
    };

    const newTodo = await service.createTodo(todoData);

    const allTodos = await service.getAllTodos();
    expect(allTodos.length).toBe(1);
    expect(allTodos[0]).toEqual(newTodo);
  });

  it('should remove a todo', async () => {
    const todoData: CreateTodoRequest = {
      title: 'Test Todo',
      description: 'Just a test',
      priority: 'low',
      assignedTo: 1
    };

    const newTodo = await service.createTodo(todoData);

    const deleted = await service.deleteTodo(newTodo.id);
    const allTodos = await service.getAllTodos();

    expect(deleted).toBeTrue();
    expect(allTodos.length).toBe(0);
  });
});
