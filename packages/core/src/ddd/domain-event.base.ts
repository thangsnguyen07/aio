import { randomUUID } from 'crypto'

import { RequestContextService } from '../application/context/app-request.context'
import { ArgumentNotProvidedException } from '../exceptions'
import { Helper } from '../utils/helper'

interface DomainEventMetadata {
  /** Timestamp when this domain event occurred */
  readonly timestamp: number

  /** ID for correlation purposes (for Integration Events,logs correlation, etc).
   */
  readonly correlationId: string

  /**
   * Causation id used to reconstruct execution order if needed
   */
  readonly causationId?: string

  /**
   * User ID for debugging and logging purposes
   */
  readonly userId?: string
}

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string
  metadata?: DomainEventMetadata
}

export abstract class DomainEvent {
  public readonly id: string

  /* Aggregate ID where domain event occurred */
  public readonly aggregateId: string

  public readonly metadata: DomainEventMetadata

  constructor(props: DomainEventProps<unknown>) {
    if (Helper.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Domain event props should not be empty')
    }

    this.id = randomUUID()
    this.aggregateId = props.aggregateId
    this.metadata = {
      correlationId: props?.metadata?.correlationId,
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    }
  }
}
