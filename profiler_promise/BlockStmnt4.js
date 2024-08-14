//@ts-check

import { ASTList } from "./ASTList.js";
import { NullStmnt } from "./NullStmnt.js";
import { funcNameStack, funcs_stack } from "./GlobalStacks.js";

export class BlockStmnt extends ASTList {
  static globalInt = 0;
  constructor(c) {super(c)}
  async *evalIterator(env) {
    for (let t of this) {
      // yield
      if (env.interpreter && env.interpreter.shouldInterrupt) {
        // console.log("inside")
        env.interpreter.shouldInterrupt = false;
        if (funcNameStack.length > 0) {
          funcs_stack.push([...funcNameStack]);
          funcs_stack.push(funcNameStack);
        }
        // yield; // This yields control back to the event loop
      }
      if (!(t instanceof NullStmnt) && 'children' in t && t.children.length != 0) {
        yield await t.eval(env);
      }
    }
  }

  async eval(env) {
    let result = 0;
    // await new Promise(resolve => setImmediate(resolve));
    for await (const r of this.evalIterator(env)) {
      result = r;
    }
    return result;
  }
}