//@ts-check

import { Worker } from 'worker_threads';
import axios from "axios";
import fs from 'fs';
import path from 'path';

export var funcs_per_10ms = [];
const unique_funcs_set = new Set();
let i = 0

const startTime = performance.now();

// Create a new worker
const worker = new Worker('./worker.js', { type: 'module' });

let sharedArray = null

const intervalId = setInterval(checkSharedBuffer, 3);

function checkSharedBuffer() {
    if (!sharedArray) return
    const arrayCopy = Array.from(sharedArray);
    const funcs = []
    for (let i = 0;i < arrayCopy.length; i++) {
      if (arrayCopy[i] == 0) break
      funcs.push(arrayCopy[i])
    }
    funcs_per_10ms.push(funcs)
    console.log("read array", funcs)
}
worker.on("message", (message) => {
  if (message.done) {
    checkSharedBuffer()
    worker.terminate()
    clearInterval(intervalId)
    console.log("done", funcs_per_10ms)
    console.log("message", message)
  } else {
    const buffer = message.sharedBuffer
    sharedArray = new Int32Array(buffer);
  }
})