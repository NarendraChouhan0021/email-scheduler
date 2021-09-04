const { createLogger, format, transports } = require('winston');
const path = require('path');
const { combine, timestamp, label, printf, colorize } = format;


const getLabel = function (callingModule) {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = function (callingModule) {
    return createLogger({
        format: combine(
            colorize({
                all: true
            }),
            label({ label: getLabel(callingModule) }),
            timestamp(),
            myFormat,
        ),
        transports: [new transports.Console()]
    });
}

module.exports = logger;