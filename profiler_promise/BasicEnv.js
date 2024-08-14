export class BasicEnv {
  values;
  constructor() {
    this.values = new Map()
    this.interpreter = null
  }
  put = (nm, value) => this.values.set(nm, value)
  get = (nm) => this.values.get(nm)
}