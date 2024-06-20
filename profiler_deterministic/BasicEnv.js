export class BasicEnv {
  values;
  constructor() {this.values = new Map()}
  put = (nm, value) => this.values.set(nm, value)
  get = (nm) => this.values.get(nm)
}