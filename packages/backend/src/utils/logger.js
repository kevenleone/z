const winston = require('winston')
const WinstonDailyRotateFile = require('winston-daily-rotate-file')

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.colorize()),
  level: 'debug',
  transports: [
    new WinstonDailyRotateFile({
      auditFile: './log/audit.json',
      datePattern: 'YYYY-MM-DD',
      filename: './log/app-%DATE%.log',
      maxFiles: '3d',
      maxSize: '10m'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

class WinstonStream {
  write (text) {
    logger.info(text.toString().replace('\n', ''))
  }
}

const winstonStream = new WinstonStream()

module.exports = {
  logger, winstonStream
}
