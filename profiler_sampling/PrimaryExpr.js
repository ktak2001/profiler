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
  eval = (env) => {
    // console.log("children.array", this.children)
    return this.evalSubExpr(env, 0);
  }
  evalSubExpr = (env, nest) => {
    if (this.hasPostfix(nest)) {
      let target = this.evalSubExpr(env, nest + 1);
      // console.log("this.postfix(nest)", this.postfix(nest))
      return this.postfix(nest).eval(env, target);
    } else {
      // console.log("primaryExpr")
      return this.operand().eval(env);
    }
  }
  // eval = (env) => {
  //   let res = this.operand().eval(env);
  //   let n = this.numChildren();
  //   for (let i = 1;i < n;i++)
  //       res = this.postfix(i).eval(env,res);
  //   return res;
  // }
}