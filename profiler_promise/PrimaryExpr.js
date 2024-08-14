//@ts-check

import { ASTList } from "./ASTList.js";

export class PrimaryExpr extends ASTList {
  constructor(c) {super(c)}
  static create = (c) => {
    // console.log("PrimaryExpr.js", c)
    // if (c.length==1)
    //     console.log("length_is_1", c[0].constructor.name)
    return c.length==1?c[0]:new PrimaryExpr(c)
  }
  operand = () => this.child(0);
  postfix = (nest) => this.child(this.numChildren() - nest - 1);
  hasPostfix = (nest) => this.numChildren() - nest > 1;
  eval = async (env) => {
    // console.log("children.array", this.children)
    return await this.evalSubExpr(env, 0);
  }
  evalSubExpr = async (env, nest) => {
    // console.log("env in PrimaryExpr", env.interpreter)
    if (this.hasPostfix(nest)) {
      let target = await this.evalSubExpr(env, nest + 1);
      // console.log("this.postfix(nest)", this.postfix(nest))
      return await this.postfix(nest).eval(env, target);
    } else {
      // console.log("primaryExpr")
      return await this.operand().eval(env);
    }
  }
}