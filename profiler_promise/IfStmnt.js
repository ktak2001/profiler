//@ts-check

import { ASTList } from "./ASTList.js";

export class IfStmnt extends ASTList {
  constructor(c) { super(c) }
  condition = () => this.child(0)
  thenBlock = () => this.child(1)
  elseBlock = () => this.numChildren()>2 ? this.child(2):null
  toString = () => "(if" + this.condition() + " " + this.thenBlock() + " else " + this.elseBlock() + ")"
  eval = async (env) => {
    // console.log("inside if")
    // console.log(this.condition())
    let c = await this.condition().eval(env)
    if (typeof c == "number" && c==1) {
      // console.log("inside ifthen")
      return await this.thenBlock().eval(env)
    }
    else {
      // console.log("inside else")
      let b = this.elseBlock();
      if (b == null) return 0;
      else {
        // console.log("inside else2")
        return await b.eval(env);
      }
    }
  }
}