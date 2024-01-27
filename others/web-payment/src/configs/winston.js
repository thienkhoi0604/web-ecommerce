const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'verbose',
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: './logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
  ]
});

module.exports = logger;