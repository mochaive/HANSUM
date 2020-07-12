const winston = require("winston")
const winstonDaily = require("winston-daily-rotate-file")
const { combine, timestamp, printf } = winston.format

// 커스텀 포맷 ( 지정한 형식으로 로그에 찍힘 )
const myFormat = printf((info) => {
    return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`
})

// logger 설정
const logger = winston.createLogger({
    // log 형식 지정
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        myFormat // custom format
    ),
    transports: [
        // log 파일 설정
        new winstonDaily({
            level: "warn",
            dirname: "./logs",
            filename: `system.log.%DATE%.log`,
            maxSize: 50000000,
            maxFiles: 1000,
        }),
    ],
})

module.exports = logger
