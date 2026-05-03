export class PostSlug {
  value: string

  constructor(value: string) {
    this.value = value

    this.validate()
  }

  private validate() {}
}
