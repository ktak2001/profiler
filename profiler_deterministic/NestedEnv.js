//@ts-check

export class NestedEnv {
  values;
  outer;
  constructor(e) {
    this.values = new Map();
    this.outer = e;
  }
  setOuter = (e) => this.outer = e;
  get = (nm) => {
    let v = this.values.get(nm);
    if (v==null && this.outer != null)
        return this.outer.get(nm);
    else return v;
  }
  putNew = (nm, value) => this.values.set(nm, value);
  put = (nm, value) => {
    let e = this.where(nm);
    if (e == null) e = this;
    e.putNew(nm, value);
  }
  where = (nm) => {
    if (this.values.get(nm) != null) return this;
    else if (this.outer == null) return null;
    return this.outer.where(nm);
  }
}