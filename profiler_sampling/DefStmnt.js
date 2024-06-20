//@ts-check

import { ASTList } from "./ASTList.js"
import { Func } from "./Func.js";

export class DefStmnt extends ASTList {
  constructor(c) { super(c) }
  name = () => this.child(0).token.value;
  parameters = () => this.child(1);
  body = () => this.child(2);
  toString = () => "(def" + this.name() + " " + this.parameters() + " " + this.body() + ")";
  eval = (env) => {
    env.putNew(this.name(), new Func(this.name(), this.parameters(), this.body(), env));
    return this.name();
  }
}