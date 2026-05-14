export class PostSlug {
  value: string

  constructor(value: string) {
    this.value = this.generateSlug(value)

    this.validate()
  }

  private validate() {}
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }
}
