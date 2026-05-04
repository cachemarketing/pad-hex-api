export class UserIsActive {
  value: boolean

  constructor(value: boolean) {
    this.value = value

    this.validate()
  }

  private validate() {}
}
