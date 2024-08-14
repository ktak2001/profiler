//@ts-check

import { BasicEnv } from "./BasicEnv.js";
import { BasicParser } from "./BasicParser.js";
import { Lexer } from "./Lexer.js";
import { NullStmnt } from "./NullStmnt.js";

export class BasicInterpreter {
  intervalId
  constructor() {
    this.shouldInterrupt = false;
  }
  main = async (args) => {
    console.log("before interval", this.intervalId)
    this.startInterval()
    console.log("after interval", this.intervalId)
    await this.run(new BasicParser(), new BasicEnv())
    this.stopInterval()
  }
  startInterval = () => {
    this.intervalId = setInterval(() => {
      this.shouldInterrupt = true;
    }, 10); // Adjust the interval as needed
  }

  stopInterval = () => {
    clearInterval(this.intervalId);
  }
  run = async (bp, env) => {
    env.interpreter = this
    console.log("env.interpreter BI", this.intervalId)
    let lexer = new Lexer();
    while (lexer.peek(0)!=null) {
      let t = bp.parse(lexer)
      // console.log("parseResult", t.constructor.name)
      if (!(t instanceof NullStmnt)) {
        let r = await t.eval(env);
        console.log("=> ", r, t.constructor.name);
      }
    }
  }
}