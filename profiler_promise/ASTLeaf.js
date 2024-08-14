//@ts-check

import { Token } from "./Token.js";

export class ASTLeaf {
  empty = [];
  token;
  constructor(t) {
    this.token=t
    // console.log("ASTLeaf", t)
  }
  child = () => {}
  numChildren = () => 0
  toString = () => this.token.value
  // *[Symbol.iterator](){}
}