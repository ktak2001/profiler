//@ts-check

import { ASTLeaf } from "./ASTLeaf.js";

export class NumberLiteral extends ASTLeaf {
  constructor(t) {super(t)}
  value = () => this.token.value
  eval = (e) => this.value();
}