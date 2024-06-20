//@ts-check
import { ASTLeaf } from "./ASTLeaf.js"
import { CheckFunc } from "./CheckFunc.js";

export class Name extends ASTLeaf {
  constructor(t) {super(t)}
  name = () => this.token.value
  // tokenType = () => this.token.tokenType
  eval = (env) => {
    let value = env.get(this.name());
    // console.log("name", this.name());
    // console.log("name.value", value.constructor.name);
    // if (value instanceof CheckFunc)
    //     console.log("inside CheckFunc")
    // console.log(this.name())
    if (value == null) throw new Error("no name");
    else return value;
  }
}