export class PostCreatedAt {
  value: Date

  constructor(value: Date) {
    this.value = value

    this.validate()
  }

  private validate() {}
}
