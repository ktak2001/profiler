//@ts-check

import { ASTList } from "./ASTList.js";

export class ParameterList extends ASTList {
  constructor(c) { 
    super(c)
    // console.log("new ParameterList", c)
  }
  name = (i) => this.child(i).token.value;
  size = () => this.numChildren();
  eval = async (env, index, value) => env.putNew(this.name(index), value);
}