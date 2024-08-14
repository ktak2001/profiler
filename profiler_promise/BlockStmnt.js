//@ts-check

import { ASTList } from "./ASTList.js";
import { NullStmnt } from "./NullStmnt.js";
import { funcNameStack, funcs_stack } from "./GlobalStacks.js";

export class BlockStmnt extends ASTList {
  static globalInt = 0;
  constructor(c) {super(c)}
  async eval(env) {
    let result = 0;
    // console.log("inside Block")
    for (let t of this) {
      
      await new Promise(resolve => setTimeout(resolve, 0));
      // shouldInterruptがtrueなら、実行中の関数を保存


      if (env.interpreter && env.interpreter.shouldInterrupt) {
        env.interpreter.shouldInterrupt = false;
        if (funcNameStack.length > 0) {
          funcs_stack.push([...funcNameStack]);
        }
      }
      if (!(t instanceof NullStmnt) && 'children' in t && t.children.length!=0) {
        result = await t.eval(env)
      }
    }
    return result;
  }
}