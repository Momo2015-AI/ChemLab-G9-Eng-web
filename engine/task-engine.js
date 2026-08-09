/**
 * ChemLab V1.5 Task Engine
 * Turns a learning-task definition into an executable activity sequence.
 */
export class TaskEngine {
  constructor({ tasks = [] } = {}) {
    this.tasks = new Map(tasks.map(task => [task.id, task]));
  }

  register(task) {
    this.tasks.set(task.id, task);
    return task;
  }

  get(id) {
    return this.tasks.get(id) || null;
  }

  start(id) {
    const task = this.get(id);
    if (!task) return null;
    return {
      taskId: task.id,
      goal: task.goal,
      activities: task.activities || [],
      currentIndex: 0,
      status: 'active'
    };
  }

  next(session) {
    if (!session || session.status !== 'active') return null;
    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.activities.length) {
      return { ...session, currentIndex: nextIndex, status: 'completed' };
    }
    return { ...session, currentIndex: nextIndex };
  }
}
