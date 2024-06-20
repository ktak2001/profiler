import { ASTList } from "./ASTList.js";
import { Func } from "./Func.js";

export class Fun extends ASTList {
  constructor(c) { super(c); }
  parameters = () => this.child(0);
  body = () => this.child(1);
  toString = () => "(fun " + this.parameters() + " " + this.body() + ")";
  eval = (env) => new Func(this.parameters(), this.body(), env);
}