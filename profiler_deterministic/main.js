//@ts-check

import { BasicInterpreter } from "./BasicInterpreter.js";
import { ClosureInterpreter } from "./ClosureInterpreter.js";
import { FuncInterpreter } from "./FuncInterpreter.js";
import { ParserRunner } from "./ParserRunner.js";
import axios from "axios";
import fs from 'fs'
import path from 'path'

const pr = new ParserRunner()
const bi = new BasicInterpreter()
const fi = new FuncInterpreter()
const ci = new ClosureInterpreter()

const startTime = performance.now();
export var time_stack = [];

fi.main()
const duration = performance.now()-startTime

const filePath = path.join("/Users/takehikazuki/Desktop/todai/first_project/profiler_deterministic/save_data", "duration.txt");
fs.appendFileSync(filePath, `Duration: ${duration}ms\n`, 'utf8');

console.log("finished measuring time")

time_stack.push({
  funcName: "main",
  parameters: [0],
  startTime,
  duration
})
time_stack.sort((a,b)=>a.startTime-b.startTime)

const sendData = () => {
  axios.put(
    "http://127.0.0.1:5000/process",
    time_stack, {
      headers:{
        "Content-Type": "application/json"
      }
    }
  ).then(res => {
    console.log("finished")
  }
  )
}
sendData();

// exec("python3 python/data_plot.py", (error, stdout, stderr) => {
//   if (error) {
//     console.error(`${error.message}`)
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// })
