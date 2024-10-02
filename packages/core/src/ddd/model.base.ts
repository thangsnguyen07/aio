import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
} from '../exceptions'
import { Helper } from '../utils/helper'

export type AggregateID = string

export type BaseProps = {
  id: AggregateID
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  version: number
}

export type CreateProps<T> = {
  id: AggregateID
  props: T
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  version?: number
}

export abstract class BaseModel<Props> {
  protected abstract _id: AggregateID

  protected readonly props: Props

  private readonly _createdAt: Date

  private _updatedAt: Date

  private _deletedAt: Date | null

  private readonly _version: number

  constructor({ id, props, createdAt, updatedAt, deletedAt, version }: CreateProps<Props>) {
    this.setId(id)
    this.validateProps(props)

    const now = new Date()
    this._createdAt = createdAt || now
    this._updatedAt = updatedAt || now
    this._deletedAt = deletedAt || null
    this._version = version || 0
    this.props = props

    this.validate()
  }

  get id() {
    return this._id
  }

  private setId(id: AggregateID) {
    this._id = id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get deletedAt(): Date | null {
    return this._deletedAt
  }

  get version(): number {
    return this._version
  }

  static isModel(model: unknown): model is BaseModel<unknown> {
    return model instanceof BaseModel
  }

  /**
   *  Checks if two entities are the same BaseModel by comparing ID field.
   * @param object BaseModel
   */
  public equals(object?: BaseModel<Props>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!BaseModel.isModel(object)) {
      return false
    }

    return this.id ? this.id === object.id : false
  }

  /**
   * Returns entity properties.
   * @return {*}  {Props & BaseProps}
   * @memberof BaseModel
   */
  public getProps(): Props & BaseProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      version: this._version,
      ...this.props,
    }

    return propsCopy
  }

  /**
   * There are certain rules that always have to be true (invariants)
   * for each entity. Validate method is called every time before
   * saving an entity to the database to make sure those rules are respected.
   */
  public abstract validate(): void

  private validateProps(props: Props): void {
    const MAX_PROPS = 50

    if (Helper.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Model props should not be empty')
    }

    if (typeof props !== 'object') {
      throw new ArgumentInvalidException('Model props should be an object')
    }

    if (Object.keys(props as any).length > MAX_PROPS) {
      throw new ArgumentOutOfRangeException(
        `Model props should not have more than ${MAX_PROPS} properties`,
      )
    }
  }
}
