//@ts-check

import { ASTList } from "./ASTList.js";
import { CheckFunc } from "./CheckFunc.js";
import { Func } from "./Func.js";
import { funcNameStack, funcs_stack } from "./GlobalStacks.js";
export var uniqueFuncId = 1

export class Arguments extends ASTList {
  constructor(c) { super(c); }
  size = () => this.numChildren();
  eval = async (callerEnv, value) => {
    if (!(value instanceof Func || value instanceof CheckFunc))
        throw new Error("bad function");
    let func = value;
    // console.log("func.name", func.name)
    let params = func.parameters;
    // console.log("params", params.children, params.children[0].token.value)
    if (this.size() != params.size())
        throw new Error("bad number of arguments");
    let newEnv = func.makeEnv();
    // console.log("params size", params.size());
    let num = 0;
    const tmpUnique = uniqueFuncId++
    if (value instanceof CheckFunc) {
      funcNameStack.push({"funcName": func.name, "uniqueId": tmpUnique})
    }
    for (let a of this) {
      await params.eval(newEnv, num++, a.eval(callerEnv));
    }
    // console.log("params.eval", newEnv)
    let paramValues = [];
    for (let k of newEnv.values) paramValues.push(k[1]);
    let res = await func.body.eval(newEnv);

    if (value instanceof CheckFunc) {
      funcNameStack.pop()
    }
    // console.log("func.finished", func.name)
    return res;
  }
}