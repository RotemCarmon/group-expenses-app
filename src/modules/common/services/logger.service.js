
import { httpService } from '@/modules/common/services/http.service'
import { config } from '@/config/config.js'


const legsLevelMap = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
}
const logPostMinLevel = 4;


const ERR_STORAGE_KEY = 'app_frontend_errors';

async function _handleLog(level = 'info', log) {
  const logMsg = log.message || log;

  if (config.env.isDev) {
    console.log(level.toUpperCase() + ':', logMsg);
  }
}



//define the time format
function getTime() {
  let now = new Date();
  return now.toLocaleString();
}

function doLog(level, ...args) {
  const strs = args.map(arg => {
    if (typeof arg === 'string') return arg
    else if (arg instanceof Error) return arg.stack || arg.message
    return JSON.stringify(arg)
  });
  var line = strs.join(' | ');
  line = `${getTime()} - ${level} - ${line} \n`;
  _handleLog(level, line)
}

export const loggerService = {
  debug(...args) {
    doLog('debug', ...args);
  },
  info(...args) {
    doLog('info', ...args);
  },
  warn(...args) {
    doLog('warn', ...args);
  },
  error(...args) {
    doLog('error', ...args);
  }
};