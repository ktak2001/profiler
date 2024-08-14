//@ts-check

import { ASTList } from "./ASTList.js";
import { CheckFunc } from "./CheckFunc.js";
import { Func } from "./Func.js";
import { processSharedArrayBuffer, funcDict } from "./processSharedArrayBuffer.js";
export var uniqueFuncId = 1

export class Arguments extends ASTList {
  constructor(c) { super(c); }
  size = () => this.numChildren();
  eval = (callerEnv, value) => {
    if (!(value instanceof Func || value instanceof CheckFunc))
        throw new Error("bad function");
    let func = value;
    let params = func.parameters;
    if (this.size() != params.size())
        throw new Error("bad number of arguments");
    let newEnv = func.makeEnv();
    let num = 0;
    const tmpUnique = uniqueFuncId++
    
    if (value instanceof CheckFunc) {
      processSharedArrayBuffer(func.name, true, tmpUnique)
    }

    for (let a of this) {
      params.eval(newEnv, num++, a.eval(callerEnv));
    }
    // console.log("params.eval", newEnv)
    let paramValues = [];
    for (let k of newEnv.values) paramValues.push(k[1]);
    let res = func.body.eval(newEnv);

    if (value instanceof CheckFunc) {
      processSharedArrayBuffer("", false)
    }
    // console.log("func.finished", func.name)
    return res;
  }
}