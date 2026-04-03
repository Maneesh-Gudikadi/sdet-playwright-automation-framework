/**
 * TestDataGenerator — Generates randomized test data to avoid hardcoded values.
 * Useful for user registration, form filling, and API body creation.
 */
export class TestDataGenerator {

  static randomEmail(domain = 'testmail.com'): string {
    const ts = Date.now();
    const rand = Math.random().toString(36).substring(2, 7);
    return `test.user.${rand}.${ts}@${domain}`;
  }

  static randomUsername(prefix = 'user'): string {
    const rand = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${rand}`;
  }

  static randomFullName(): string {
    const firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hiro'];
    const lastNames  = ['Smith', 'Johnson', 'Lee', 'Garcia', 'Chen', 'Patel', 'Kim', 'Wang'];
    return `${this.pick(firstNames)} ${this.pick(lastNames)}`;
  }

  static randomPassword(length = 12): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  static randomInt(min = 1, max = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  static randomPhone(): string {
    const area = this.randomInt(200, 999);
    const mid  = this.randomInt(100, 999);
    const last = this.randomInt(1000, 9999);
    return `+1-${area}-${mid}-${last}`;
  }

  static timestamp(): string {
    return new Date().toISOString();
  }

  static pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ─── Typed Factories ─────────────────────────────────────────────────────

  static createUser(overrides: Partial<UserPayload> = {}): UserPayload {
    return {
      name:     this.randomFullName(),
      email:    this.randomEmail(),
      job:      this.pick(['Engineer', 'QA Lead', 'Developer', 'Architect', 'Manager']),
      password: this.randomPassword(),
      ...overrides,
    };
  }
}

export interface UserPayload {
  name: string;
  email: string;
  job: string;
  password: string;
}
