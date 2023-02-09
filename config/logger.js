const winston = require("winston");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transports: [
    new winston.transports.Console({
      level: "debug",
      stderrLevels: ["error"],
      format: winston.format.combine(
        enumerateErrorFormat(),
        process.env.NODE_ENV === "development"
          ? winston.format.colorize()
          : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
      ),
      handleExceptions: true,
    }),
  ],
});

module.exports = logger;
