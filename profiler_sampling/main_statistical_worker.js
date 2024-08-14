//@ts-check

import { Worker } from "worker_threads";
import axios from "axios";
import fs from "fs";
import path from "path";

// Get the filepath from command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Please provide a filepath as an argument.");
  process.exit(1);
}
const filepath = args[0];

// Extract the filename without the .txt extension
const filename = path.basename(filepath, ".txt");

export var funcs_per_10ms = [];
let i = 0;

const startTime = performance.now();

// Create a new worker and pass the filename as an argument
const worker = new Worker(
  "/Users/takehikazuki/Desktop/todai/first_project/profiler_sampling/worker.js",
  {
    type: "module",
    workerData: { filepath },
  }
);
let sharedArray = null;

const intervalId = setInterval(checkSharedBuffer, 1);

console.log("in mainsampling");

function checkSharedBuffer() {
  if (!sharedArray) return;
  const arrayCopy = Array.from(sharedArray);
  const funcs = [];
  for (let i = 0; i < arrayCopy.length; i++) {
    if (arrayCopy[i] == 0) break;
    funcs.push(arrayCopy[i]);
  }
  funcs_per_10ms.push(funcs);
  // console.log("read array", funcs)
}

worker.on("message", (message) => {
  if (message.done) {
    checkSharedBuffer();
    worker.terminate();
    clearInterval(intervalId);
    const duration = performance.now() - startTime;
    fs.appendFileSync(
      "/Users/takehikazuki/Desktop/todai/first_project/text_datas/duration.txt",
      `${filename}, statistical_worker: ${duration}ms\n`,
      "utf8"
    );
    // console.log("done", funcs_per_10ms);
    // console.log("message", message);
    // axios.put('http://127.0.0.1:5001/process_sampling',
    // {
    //   funcs_per_10ms,
    //   unique_funcs: message.funcDict
    // }, {
    //     headers:{
    //       "Content-Type": "application/json"
    //     }
    //   }
    // )
  } else {
    const buffer = message.sharedBuffer;
    sharedArray = new Int32Array(buffer);
  }
});
