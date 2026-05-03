export class PostBeforeTitle {
  value: string | null

  constructor(value: string | null) {
    this.value = value
    this.validate()
  }

  private validate() {}
}
