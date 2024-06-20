console.log("loading CommonParser");

import { Operators, Parser } from "./Parser.js";
import { PrimaryExpr } from "./PrimaryExpr.js";

export class CommonParser {
  constructor() {
    this.reserved = new Set();
    this.operators = new Operators(); // Correctly instantiate Operators
    this.expr0 = Parser.rule();
    this.primary = Parser.rule(Parser.PrimaryExpr)
      .or([
        Parser.rule().sep(["("]).ast(this.expr0).sep([")"]),
        Parser.rule().number(Parser.NumberLiteral),
        Parser.rule().identifier2(Parser.Name, this.reserved),
        Parser.rule().string(Parser.StringLiteral),
      ]);
    this.factor = Parser.rule(null).or([
      Parser.rule(Parser.NegativeExpr).sep(["-"]).ast(this.primary),
      this.primary,
    ]);
    this.expr = this.expr0.expression(Parser.BinaryExpr, this.factor, this.operators);
    this.simple = Parser.rule(PrimaryExpr).ast(this.expr);
  }
}
