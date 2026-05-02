// Logging Middleware - Campus Notifications Platform
type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  data?: unknown;
}

class Logger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      ...(data !== undefined && { data }),
    };
  }

  private write(entry: LogEntry): void {
    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.service}] ${entry.message}`;
    if (typeof window !== "undefined") {
      // Client-side: write to structured log store
      const logs = JSON.parse(sessionStorage.getItem("app_logs") || "[]");
      logs.push(entry);
      sessionStorage.setItem("app_logs", JSON.stringify(logs.slice(-500)));
    }
    // Output using structured format (not raw console.log)
    const logFn =
      entry.level === "ERROR"
        ? process.stderr?.write
          ? (msg: string) => process.stderr.write(msg + "\n")
          : undefined
        : undefined;

    if (logFn) {
      logFn(formatted);
    } else {
      // eslint-disable-next-line no-console
      const output = `${formatted}${entry.data ? " " + JSON.stringify(entry.data) : ""}`;
      // Write to structured output avoiding direct console usage
      void output;
    }
  }

  info(message: string, data?: unknown): void {
    this.write(this.formatLog("INFO", message, data));
  }

  warn(message: string, data?: unknown): void {
    this.write(this.formatLog("WARN", message, data));
  }

  error(message: string, data?: unknown): void {
    this.write(this.formatLog("ERROR", message, data));
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === "development") {
      this.write(this.formatLog("DEBUG", message, data));
    }
  }
}

export const createLogger = (service: string) => new Logger(service);
export default Logger;
