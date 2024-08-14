//@ts-check

import { FuncInterpreter } from "./FuncInterpreter.js";
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

const fi = new FuncInterpreter(filepath);
// Extract the filename without the .txt extension
const filename = path.basename(filepath, ".txt");


const startTime = performance.now();
export var time_stack = [];

console.log("inside main");

fi.main();
const duration = performance.now() - startTime;
fs.appendFileSync(
  "/Users/takehikazuki/Desktop/todai/first_project/text_datas/duration.txt",
  `${filename}, no_check: ${duration}ms\n`,
  "utf8"
);

console.log("finished measuring time");

// time_stack.push({
//   funcName: "main",
//   parameters: [0],
//   startTime,
//   duration
// })
time_stack.sort((a, b) => a.startTime - b.startTime);

const sendData = () => {
  axios
    .put("http://127.0.0.1:5000/process_event_based", time_stack, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log("finished");
    });
};
sendData();

// exec("python3 python/data_plot.py", (error, stdout, stderr) => {
//   if (error) {
//     console.error(`${error.message}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });

// CPU使わせてくれない率がプログラムによって変わる
// 両方worker thread使う. event-basedの場合は各関数において時間を測るのがオーバーヘッド
// 各関数の頭でworker thread側で時間を作ってくれる
// statisticalでは、別スレッドでsetinterval
// コールスタックを自前で実装するかコールスタックを少し改造
// interpreter言語の際、同期処理の際。
// denoは非同期ランタイムが低くなる
// 別のnode process。標準出力使う。
// 非同期ランタイムはV8には直接ない。非同期ランタイム