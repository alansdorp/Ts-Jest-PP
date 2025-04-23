import { TaskManager } from "../app/exercise/e1";
describe("Test on ej1 component", () => {
  test("Should call addTask and getTasks methods", async () => {
    const instance = new TaskManager();
    instance.addTask("test task");
    const tasksList = instance.getTasks();
    expect(tasksList).toEqual(["test task"]);
  });
  test("Should call markTaskAsCompleted method and return error", async () => {
    try {
      const instance = new TaskManager();
      instance.markTaskAsCompleted(-1);
    } catch (error) {
      expect(error).toEqual(Error("Índice de tarea inválido"));
    }
  });
  test("Should call markTaskAsCompleted method and return error", async () => {
    try {
      const instance = new TaskManager();
      instance.markTaskAsCompleted(2);
    } catch (error) {
      expect(error).toEqual(Error("Índice de tarea inválido"));
    }
  });
  test("Should addTask, call markTaskAsCompleted method and complete this task", async () => {
    const instance = new TaskManager();
    instance.addTask("test task");
    instance.markTaskAsCompleted(0);
    const tasksCompleted = instance.getTasks()[0];
    expect(tasksCompleted).toEqual("[Completada] test task")
  });
  test("Should complete a task and clear completed tasks", async () => {
    const instance = new TaskManager();
    instance.addTask("test 1");
    instance.addTask("test 2");
    instance.addTask("test 3");
    instance.addTask("test 4");
    instance.markTaskAsCompleted(3);
    instance.markTaskAsCompleted(2);
    instance.clearCompletedTasks();
    const tasksList = instance.getTasks();
    expect(tasksList).toEqual(["test 1", "test 2"]);
  });
  test("Should call loadTasks", async () => {
    const instance = new TaskManager();
    instance.loadTasks(["task 1.1", "task 1.2", "task 1.3", "task 1.4"]);
    const tasksList = instance.getTasks();
    expect(tasksList).toEqual(["task 1.1", "task 1.2", "task 1.3", "task 1.4"]);
  });
});
