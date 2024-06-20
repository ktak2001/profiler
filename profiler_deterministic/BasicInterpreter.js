//@ts-check

import { BasicEnv } from "./BasicEnv.js";
import { BasicParser } from "./BasicParser.js";
import { Lexer } from "./Lexer.js";
import { NullStmnt } from "./NullStmnt.js";

export class BasicInterpreter {
  main = (args) => this.run(new BasicParser(), new BasicEnv())
  run = (bp, env) => {
    let lexer = new Lexer();
    while (lexer.peek(0)!=null) {
      let t = bp.parse(lexer)
      // console.log("parseResult", t.constructor.name)
      if (!(t instanceof NullStmnt)) {
        let r = t.eval(env);
        // console.log("=> ", r);
      }
    }
  }
}