import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"

export class UserId extends Uuid {
  constructor(value: string) {
    super(value)
  }
}
