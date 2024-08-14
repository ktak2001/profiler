//@ts-check

import { FuncInterpreter } from "./FuncInterpreter.js";
import fs from 'fs'
import path from 'path'
import { funcs_stack, unique_funcs } from "./GlobalStacks.js";
import axios from "axios";

const fi = new FuncInterpreter()


const executeMain = async () => {
  const startTime = performance.now();
  console.log("inside main")
  await fi.main()
  // console.log("finished measuring time")
  const duration = performance.now()-startTime
  // console.log(funcs_stack)
  
  const filePath = path.join("/Users/takehikazuki/Desktop/todai/first_project/profiler_promise/save_data", "duration_promise.txt");
  fs.appendFileSync(filePath, `Duration: ${duration}ms\n`, 'utf8');
  
  
  // const sendData = () => {
  //   axios.put(
  //     "http://127.0.0.1:5000/process_promise",
  //     {funcs_per_10ms: funcs_stack, unique_funcs}, {
  //       headers:{
  //         "Content-Type": "application/json"
  //       }
  //     }
  //   ).then(res => {
  //       console.log("finished")
  //     }
  //   )
  // }
  // sendData();
}

executeMain()