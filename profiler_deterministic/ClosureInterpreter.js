import { BasicInterpreter } from "./BasicInterpreter.js";
import { ClosureParser } from "./ClosureParser.js";
import { NestedEnv } from "./NestedEnv.js";

export class ClosureInterpreter extends BasicInterpreter {
  main = (args) => this.run(new ClosureParser(), new NestedEnv());
}