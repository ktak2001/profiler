import { isMainThread, parentPort, workerData } from 'worker_threads';
import { FuncInterpreter } from "./FuncInterpreter.js";
// import { funcs_per_10ms } from './main_sampling.js';
const { filepath } = workerData;
const fi = new FuncInterpreter(filepath);

console.log("in worker")

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