//@ts-check

import { ASTLeaf } from "./ASTLeaf.js";

export class StringLiteral extends ASTLeaf {
  constructor(t) {super(t)}
  value = () => this.token.value;
  eval = async(e) => this.value();
}