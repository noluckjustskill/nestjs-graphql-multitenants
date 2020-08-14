import { DataSensitivity } from '../enums/data-sensitivity.enum';
import { LogCatagories } from '../enums/log-categories.enum';
import { LoggableActions } from '../enums/loggable-actions.enum';

interface LogData {
  sensitivity: DataSensitivity;
  action?: LoggableActions;
  meta?: any;
  category?: LogCatagories;
}

interface ErrorLogData extends LogData {
  err?: any;
}

export interface CustomLogger {
  trace(logData: LogData, msg?: string, ...args: any[]): void;
  debug(logData: LogData, msg?: string, ...args: any[]): void;
  info(logData: LogData, msg?: string, ...args: any[]): void;
  warn(logData: LogData, msg?: string, ...args: any[]): void;
  error(errorLogData: ErrorLogData, msg?: string, ...args: any[]): void;
  fatal(errorLogData: ErrorLogData, msg?: string, ...args: any[]): void;
  setContext(value: string): void; // See PinoLogger from nestjs-pino
}
