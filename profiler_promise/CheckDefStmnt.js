//@ts-check

import { ASTList } from "./ASTList.js"
import { CheckFunc } from "./CheckFunc.js";
import { unique_funcs } from "./GlobalStacks.js";

export class CheckDefStmnt extends ASTList {
  constructor(c) { super(c) }
  name = () => this.child(0).token.value;
  parameters = () => this.child(1);
  body = () => this.child(2);
  toString = () => "(check_def" + this.name() + " " + this.parameters() + " " + this.body() + ")";
  eval = async (env) => {
    env.putNew(this.name(), new CheckFunc(this.name(), this.parameters(), this.body(), env))
    unique_funcs[this.name()] = true
    return this.name();
  }
}