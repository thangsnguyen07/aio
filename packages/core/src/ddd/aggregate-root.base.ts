import { EventEmitter2 } from '@nestjs/event-emitter'

import { LoggerPort } from '../ports/logger.port'
import { DomainEvent } from './domain-event.base'
import { BaseModel } from './model.base'

export abstract class AggregateRoot<Props> extends BaseModel<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  public clearDomainEvents(): void {
    this._domainEvents = []
  }

  public async publishEvents(logger: LoggerPort, eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        logger.debug(
          `[${
            event.constructor.name
          }] event published for aggregate ${this.constructor.name} : ${this.id}`,
        )

        return eventEmitter.emitAsync(event.constructor.name, event)
      }),
    )

    this.clearDomainEvents()
  }
}
