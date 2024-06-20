//@ts-check

import { ASTList } from "./ASTList.js";
import { NullStmnt } from "./NullStmnt.js";

export class BlockStmnt extends ASTList {
  static globalInt = 0;
  constructor(c) {super(c)}
  eval = (env) => {
    let result = 0;
    let i=0;
    // console.log("inside Block", env)
    for (let t of this) {
      // console.log("get t class name", t.constructor.name)
      if (!(t instanceof NullStmnt) && 'children' in t && t.children.length!=0) {
        // console.log(i++, "blockChildren", t)
        result = t.eval(env)
        // console.log("result", t.constructor.name, result)
      }
    }
    // console.log("getOut Block", result, env)
    return result;
  }
}