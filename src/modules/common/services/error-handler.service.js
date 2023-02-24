import Vue from 'vue';
import { logError } from './helpers'

import { loggerService } from './logger.service';


window.onerror = (error) => {
  if (error === 'ResizeObserver loop limit exceeded') {
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    return
  }
  console.log('************ WINDOW ERROR HANDLER **************')
  console.error(error)
  console.log('************************************************')

  // doLog('ERROR', error);
  loggerService.error(error.message);
}

// vm: component in which error occured
// info: Vue specific error information such as lifecycle hooks, events etc.
Vue.config.errorHandler = (err, vm, info) => {
  console.log('************ VUE ERROR HANDLER **************')
  console.error(err)
  console.error(vm.$vnode.tag)
  console.error(info)
  console.log('*********************************************')


  loggerService.error(err.message, vm.$vnode.tag, info);

  // doLog('ERROR', err, vm.$vnode.tag, info);
  // logError({ err: err.message, stack: JSON.stringify(err.stack), tag: vm.$vnode.tag, info })
};
