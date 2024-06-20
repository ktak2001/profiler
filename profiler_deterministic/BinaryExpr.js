//@ts-check

import { ASTList } from "./ASTList.js"
import { Name } from "./Name.js"

export class BinaryExpr extends ASTList {
  constructor(c) {super(c)}
  left = () => this.child(0)
  operator = () => this.child(1).token.value
  right = () => this.child(2)
  eval = (env) => {
    // console.log("inside Binary")
    let op = this.operator();
    if (op=="=") {
      // console.log("inside equal")
      let r = this.right().eval(env);
      return this.computeAssign(env, r);
    } else {
      let l = this.left().eval(env);
      let r = this.right().eval(env);
      return this.computeOp(l,op,r);
    }
  }
  computeAssign = (env, rvalue) => {
    // console.log("inside computeAssign")
    let l = this.left();
    if (l instanceof Name) {
      env.put(l.name(), rvalue)
      // console.log("BE cA", rvalue);
      return rvalue;
    } else {
      throw new Error("bad Assignment")
    }
  }
  computeOp = (left, op, right) => {
    // console.log("inside computeOp", left, op, right)
    if (typeof left === "number" && typeof right === "number")
      return this.computeNumber(left, op, right);
    else if (op=="+") return left + right
    else if (op=="==") {
      // console.log("inside ==")
      if (left==null) return right==null;
      else return left == right;
    }
    else {
      // console.log("left,op,right ", left,op,right)
      // console.log(Number(left) + Number(right))
      throw new Error("bad type")
    }
  }
  computeNumber = (l, op, r) => {
    // console.log("inside computeNumber", l,op,r)
    if (op=="+") return l+r;
    else if (op=="-") return l-r;
    else if (op=="*") return l*r;
    else if (op=="/") return l/r;
    else if (op=="%") return l%r;
    else if (op=="==") return l==r?1:0;// ここ1or0にする?
    else if (op==">") return l>r?1:0;
    else if (op=="<") return l<r?1:0;
    else throw new Error("bad operator")
  }
}