import { Arguments } from "./Arguments.js";
import { BasicParser } from "./BasicParser.js";
import { CheckDefStmnt } from "./CheckDefStmnt.js";
import { DefStmnt } from "./DefStmnt.js";
import { ParameterList } from "./ParameterList.js";
import { Parser } from "./Parser.js";

export class FuncParser extends BasicParser {
  param = Parser.rule().identifier(this.reserved);
  params = Parser.rule(ParameterList).ast(this.param).repeat(Parser.rule().sep([","]).ast(this.param));
  paramList = Parser.rule().sep(["("]).maybe(this.params).sep([")"]);
  def = Parser.rule(DefStmnt).sep(["def"]).identifier(this.reserved).ast(this.paramList).ast(this.block);
  check_def = Parser.rule(CheckDefStmnt).sep(["check_def"]).identifier(this.reserved).ast(this.paramList).ast(this.block);
  args = Parser.rule(Arguments).ast(this.expr).repeat(Parser.rule().sep([","]).ast(this.expr));
  postfix = Parser.rule().sep(["("]).maybe(this.args).sep([")"]);
  constructor() {
    super();
    this.reserved.add(")");
    this.primary.repeat(this.postfix);
    this.simple.option(this.args);
    this.program.insertChoice(this.def);
    this.program.insertChoice(this.check_def);
  }
}