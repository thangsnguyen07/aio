export class FindTodoByIdEvent {
  public static EVENT_NAME = 'find_todo_by_id'
  constructor(public readonly id: string) {}
}
