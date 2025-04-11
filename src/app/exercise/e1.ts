export class TaskManager {
    private tasks: string[] = [];
    // private taskRepository: TaskRepository;

    // constructor(taskRepository: TaskRepository) {
    //   this.taskRepository = taskRepository;
    // }
    
  
    addTask(task: string): void {
      this.tasks.push(task);
    }
  
    getTasks(): string[] {
      return this.tasks;
    }
  
    markTaskAsCompleted(taskIndex: number): void {
      if (taskIndex < 0 || taskIndex >= this.tasks.length) {
        throw new Error('Índice de tarea inválido');
      }
      this.tasks[taskIndex] = `[Completada] ${this.tasks[taskIndex]}`;
    }
  
    clearCompletedTasks(): void {
      this.tasks = this.tasks.filter(task => !task.startsWith('[Completada]'));
    }
  
    loadTasks(tasks: string[]): void {
      this.tasks = [...tasks];
    }
  
    // Ejemplo de cómo se podría usar una dependencia (TaskRepository) y cómo se mockearía en las pruebas
    //
    // async saveTask(task: string): Promise<void> {
    //   await this.taskRepository.save(task);
    //   this.tasks.push(task);
    // }
  }
  
  // Ejemplo de una interfaz de dependencia (para la demostración de mocks)
  // export interface TaskRepository {
  //   save(task: string): Promise<void>;
  //   getTasks(): Promise<string[]>;
  // }