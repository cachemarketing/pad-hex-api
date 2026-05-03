export class PostTitle {
  value: string
  constructor(value: string) {
    this.value = value
  }

  private validate() {
    if (!this.value) {
      throw new Error("Post Title is required")
    }
    if (this.value.length < 3) {
      throw new Error("Post Title must be at least 3 characters long")
    }
  }
}
