export class CreateTodoEvent {
  public static EVENT_NAME = 'create_todo'
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
