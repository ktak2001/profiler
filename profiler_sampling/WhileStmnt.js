//@ts-check

import { ASTList } from "./ASTList.js";

export class WhileStmnt extends ASTList {
  constructor(c) {super(c)}
  condition = () => this.child(0)
  body = () => this.child(1)
  toString = () => "(while" + this.condition() + " " + this.body() + ")"
  eval = (env) => {
    let result = 0;
    for (;;) {
      // console.log("inside while")
      // console.log("while.body", this.body())
      let c = this.condition().eval(env);
      if (typeof c == "number" && c==0) return result;
      else result = this.body().eval(env);
    }
  }
}