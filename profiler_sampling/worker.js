import { isMainThread, parentPort } from 'worker_threads';
import { FuncInterpreter } from "./FuncInterpreter.js";
const fi = new FuncInterpreter();

let lastIdx = 0

import { sharedBuffer, funcDict } from './processSharedArrayBuffer.js';
parentPort.postMessage({
  sharedBuffer
})
fi.main()
parentPort.postMessage({
  "done": true,
  funcDict
})
// finishWorker()

// parentPort.postMessage({
//   "done": true,
//   funcDict
// })

// if (!isMainThread) {
//   parentPort.on('message', (message) => {
//     if (message === 'start') {
//       parentPort.postMessage({
//         log: "started fi.main"
//       });
//       // fi.main();
//     } else if (message === 'getFuncStack') {
//       console.log("inside getFuncStack")
//       parentPort.postMessage({
//         "func_stack": func_stack
//       })
//     }
//   });
// }

// worker threadsは使うべき
// shared array bufferにworker側がpostし、それをmainが10msごとに取得する