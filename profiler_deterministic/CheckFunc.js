import { NestedEnv } from "./NestedEnv.js";

export class CheckFunc {
  name;
  parameters;
  body;
  env;
  constructor(name, parameters, body, env) {
    // console.log("constructCheckFunc")
    this.name=name;
    this.parameters=parameters;
    this.body=body;
    this.env=env;
  }
  makeEnv = () => new NestedEnv(this.env);
}