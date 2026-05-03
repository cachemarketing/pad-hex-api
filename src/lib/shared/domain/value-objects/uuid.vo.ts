export abstract class Uuid {
  readonly value: string

  constructor(value: string) {
    this.value = value
    this.ensureValidUuid(value)
  }

  private ensureValidUuid(value: string): void {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!value) {
      throw new Error(`${this.constructor.name}: value is required`)
    }

    if (!regex.test(value)) {
      throw new Error(
        `${this.constructor.name}: <${value}> is not a valid UUID`,
      )
    }
  }

  equals(other: Uuid): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
