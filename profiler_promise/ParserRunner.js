//@ts-check

import { BasicParser } from "./BasicParser.js";
import { Lexer } from "./Lexer.js";

export class ParserRunner {
  lx;
  bp;
  i;
  main = () => {
    while (this.lx.peek(0) != null) {
      let ast = this.bp.parse(this.lx)
      // console.log("result of the parserrunner: ", this.i++)
      // console.log(ast+"\n")
    }
  }
  constructor() {
    this.lx = new Lexer()
    this.bp = new BasicParser()
    this.i=0
  }
}