import { NestedEnv } from "./NestedEnv.js";

export class Func {
  name;
  parameters;
  body;
  env;
  constructor(name,parameters, body, env) {
    this.name=name;
    this.parameters=parameters;
    this.body=body;
    this.env=env;
  }
  makeEnv = () => new NestedEnv(this.env);
}