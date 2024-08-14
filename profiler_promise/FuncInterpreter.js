//@ts-check

import { FuncParser } from "./FuncParser.js";
import { NestedEnv } from "./NestedEnv.js";
import { Lexer } from "./Lexer.js";
import { NullStmnt } from "./NullStmnt.js";
import { funcs_stack } from "./GlobalStacks.js";

export class FuncInterpreter {
  intervalId
  constructor() {
    this.shouldInterrupt = false;
    this.finished = false
  }
  main = async (args) => {
    this.startInterval()
    await this.run(new FuncParser(), new NestedEnv());
  }
  
  startInterval = () => {
    this.intervalId = setInterval(() => {
      this.shouldInterrupt = true;
    }, 10);
  }

  // startInterval = () => {
  //   this.intervalId = setInterval(() => {
  //     this.shouldInterrupt = true;
  //     if (this.finished) {
  //       clearInterval(this.intervalId)
  //       console.log("finished")
  //       console.log(funcs_stack)
  //     }
  //   }, 1);
  // }

  // stopInterval = () => {
  //   clearInterval(this.intervalId);
  // }

  run = async (bp, env) => {
    env.interpreter = this
    let lexer = new Lexer();
    while (lexer.peek(0)!=null) {
      let t = bp.parse(lexer)
      if (!(t instanceof NullStmnt)) {
        let r = await t.eval(env);
        // console.log("=> ", r, t.constructor.name);
      }
    }
    this.finished = true
  }
}

