//@ts-check

import { BasicInterpreter } from "./BasicInterpreter.js";
import { FuncParser } from "./FuncParser.js";
import { NestedEnv } from "./NestedEnv.js";

export class FuncInterpreter extends BasicInterpreter {
  main = (args) => this.run(new FuncParser(), new NestedEnv());
}