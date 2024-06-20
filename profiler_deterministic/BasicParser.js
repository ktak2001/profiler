//@ts-check

import { BinaryExpr } from "./BinaryExpr.js"
import { BlockStmnt } from "./BlockStmnt.js"
import { IfStmnt } from "./IfStmnt.js"
import { Name } from "./Name.js"
import { NegativeExpr } from "./NegativeExpr.js"
import { NullStmnt } from "./NullStmnt.js"
import { NumberLiteral } from "./NumberLiteral.js"
import { Operators, Parser } from "./Parser.js"
import { PrimaryExpr } from "./PrimaryExpr.js"
import { StringLiteral } from "./StringLiteral.js"
import { Token } from "./Token.js"
import { WhileStmnt } from "./WhileStmnt.js"
// import { Parser } from "./Parser.js"

export class BasicParser {
  reserved = new Set()
  operators = new Operators()
  expr0 = Parser.rule()
  primary = Parser.rule(PrimaryExpr)
    .or([Parser.rule().sep(["("]).ast(this.expr0).sep([")"]),
      Parser.rule().number(NumberLiteral),
      Parser.rule().identifier2(Name,this.reserved),
      Parser.rule().string(StringLiteral)])
  factor = Parser.rule(null).or([Parser.rule(NegativeExpr).sep(["-"]).ast(this.primary),this.primary])
  expr = this.expr0.expression(BinaryExpr, this.factor, this.operators)
  statement0 = Parser.rule()
  block = Parser.rule(BlockStmnt)
    .sep(["{"]).option(this.statement0)
    .repeat(Parser.rule().sep([";", "\\n"]).option(this.statement0))
    .sep(["}"])
  simple = Parser.rule(PrimaryExpr).ast(this.expr)
  statement = this.statement0.or([
    Parser.rule(IfStmnt).sep(["if"]).ast(this.expr).ast(this.block).option(Parser.rule().sep(["else"]).ast(this.block)),
    Parser.rule(WhileStmnt).sep(["while"]).ast(this.expr).ast(this.block),this.simple
  ])
  program = Parser.rule().or([this.statement, Parser.rule(NullStmnt)]).sep([";", "\\n"])
  constructor() {
    this.reserved.add(";")
    this.reserved.add("}")
    this.reserved.add("\\n")
    this.operators.add("=",1,Operators.RIGHT)
    this.operators.add("==",2,Operators.LEFT)
    this.operators.add("<",2,Operators.LEFT)
    this.operators.add(">",2,Operators.LEFT)
    this.operators.add("+",3,Operators.LEFT)
    this.operators.add("-",3,Operators.LEFT)
    this.operators.add("*",4,Operators.LEFT)
    this.operators.add("/",4,Operators.LEFT)
    this.operators.add("%",4,Operators.LEFT)
  }
  parse = (lexer) => this.program.parse(lexer)
}