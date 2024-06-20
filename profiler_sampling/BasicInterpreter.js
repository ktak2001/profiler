import { BasicEnv } from "./BasicEnv.js";
import { BasicParser } from "./BasicParser.js";
import { Lexer } from "./Lexer.js";
import { NullStmnt } from "./NullStmnt.js";
import {isMainThread, parentPort} from 'worker_threads'

let finished = false

export class BasicInterpreter {
  main = (args) => this.run(new BasicParser(), new BasicEnv())
  run = (bp, env) => {
    let lexer = new Lexer();
    // bp.getFuncs()
    while (lexer.peek(0)!=null) {
      let t = bp.parse(lexer)
      console.log("parseResult", t.constructor.name)
      if (!(t instanceof NullStmnt)) {
        let r = t.eval(env);
        console.log("=> ", r);
      }
      if (lexer.peek(0) == null) finished = true
    }
    // parentPort.postMessage({
    //   "done": finished
    // });
  }
}