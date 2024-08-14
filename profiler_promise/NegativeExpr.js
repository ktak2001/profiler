//@ts-check

import { ASTList } from "./ASTList.js";

export class NegativeExpr extends ASTList {
  constructor(c) {super(c)}
  operand = () => this.child(0)
  toString = () => "-" + this.operand()
  eval = async (env) => {
    let v = this.operand().eval(env);
    return -v;
  }
}