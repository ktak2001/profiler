import { Fun } from "./Fun.js";
import { FuncParser } from "./FuncParser.js";
import { Parser } from "./Parser.js";

export class ClosureParser extends FuncParser {
  constructor() {
    super();
    this.primary.insertChoice(Parser.rule(Fun).sep(["fun"]).ast(this.paramList).ast(this.block));
  }
}