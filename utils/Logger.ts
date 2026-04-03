/**
 * Logger — Structured console logging for test steps.
 * Color-coded output for better readability in CI logs.
 */
export class Logger {
  private static readonly COLORS = {
    reset:   '\x1b[0m',
    green:   '\x1b[32m',
    yellow:  '\x1b[33m',
    red:     '\x1b[31m',
    cyan:    '\x1b[36m',
    magenta: '\x1b[35m',
    bold:    '\x1b[1m',
  };

  static info(message: string, data?: unknown): void {
    const ts = new Date().toISOString();
    console.log(`${this.COLORS.cyan}[INFO]${this.COLORS.reset} ${ts} — ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }

  static success(message: string, data?: unknown): void {
    const ts = new Date().toISOString();
    console.log(`${this.COLORS.green}[PASS]${this.COLORS.reset} ${ts} — ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }

  static warn(message: string, data?: unknown): void {
    const ts = new Date().toISOString();
    console.warn(`${this.COLORS.yellow}[WARN]${this.COLORS.reset} ${ts} — ${message}`);
    if (data) console.warn(JSON.stringify(data, null, 2));
  }

  static error(message: string, error?: unknown): void {
    const ts = new Date().toISOString();
    console.error(`${this.COLORS.red}[FAIL]${this.COLORS.reset} ${ts} — ${message}`);
    if (error) console.error(error);
  }

  static step(stepName: string): void {
    console.log(`\n${this.COLORS.magenta}${this.COLORS.bold}▶ STEP: ${stepName}${this.COLORS.reset}`);
  }

  static apiRequest(method: string, url: string, body?: unknown): void {
    console.log(`${this.COLORS.cyan}[API →]${this.COLORS.reset} ${method} ${url}`);
    if (body) console.log('  Body:', JSON.stringify(body));
  }

  static apiResponse(status: number, body?: unknown): void {
    const color = status < 400 ? this.COLORS.green : this.COLORS.red;
    console.log(`${color}[API ←]${this.COLORS.reset} ${status}`);
    if (body) console.log('  Response:', JSON.stringify(body, null, 2));
  }
}
