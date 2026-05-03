import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"

export class PostAuthorId extends Uuid {
  constructor(value: string) {
    super(value)
  }
}
