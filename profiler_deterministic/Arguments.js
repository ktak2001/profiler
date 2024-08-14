//@ts-check

import { ASTList } from "./ASTList.js";
import { CheckFunc } from "./CheckFunc.js";
import { Func } from "./Func.js";
import { time_stack } from "./main_event_based.js";

export class Arguments extends ASTList {
  constructor(c) { super(c); }
  size = () => this.numChildren();
  eval = (callerEnv, value) => {
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
    let startTime=0, endTime=0
    if (value instanceof CheckFunc)
      startTime = performance.now();
    for (let a of this) {
      params.eval(newEnv, num++, a.eval(callerEnv));
    }
    let paramValues = [];
    for (let k of newEnv.values) paramValues.push(k[1]);
    let res = func.body.eval(newEnv);

    if (value instanceof CheckFunc) {
      endTime = performance.now();
      time_stack.push({
        funcName: func.name,
        parameters: paramValues,
        startTime,
        duration: endTime-startTime
      })
    }
    // console.log("func.finished", func.name)
    return res;
  }
}