//@ts-check

class ASTList {
  children = [];
  constructor(list) {this.children=list}
  child = (i) => this.children[i]
  numChildren = () => this.children.length
  toString = () => {
    if (this.children.length==1) return this.children[0].toString();
    let res="("
    this.children.forEach((e,i) => {
      if (i>0) res+=" "
      res+=e.toString()
    })
    return res+")"
  }
  *[Symbol.iterator]() {
    for (let c of this.children) yield c;
  }
}

export {ASTList}