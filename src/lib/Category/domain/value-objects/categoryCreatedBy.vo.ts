import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"

export class CategoryCreatedBy extends Uuid {
  constructor(value: string) {
    super(value)
  }
}
