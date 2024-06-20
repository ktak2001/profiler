//@ts-check

import { Token } from "./Token.js";
import { ASTLeaf } from "./ASTLeaf.js";
import { PrimaryExpr } from "./PrimaryExpr.js";
import { ASTList } from "./ASTList.js";

export class Parser {
  elements;
  factory;
  constructor(clazz) {
    if (clazz!=null && clazz.constructor.name == "Parser") this.elements=clazz.elements, this.factory=clazz.factory
    else this.reset(clazz)
  }
  reset_blank = () => {
    this.elements = [];
    return this;
  }
  reset = (clazz) => {
    this.elements = []
    this.factory=Factory.getForASTList(clazz)
    return this;
  }
  static k=0;
  parse = (lexer) => {
    let results = [];
    // console.log("parser.parse.lexer",lexer.constructor.name)

    for (let e of this.elements) {
      // console.log(Parser.k++, "parse", e.constructor.name)
      e.parse(lexer, results)
    }
    // console.log("parser.parse.results", results[0].constructor.name)
    return this.factory.make(results)
  }
  match = (lexer) => {
    if (this.elements.length==0) return true;
    let e=this.elements[0]
    // console.log("@parser.match:" + e.constructor.name)
    // console.log("@parser.match:", lexer.constructor.name)
    return e.match(lexer);
  }
  // rule = () => Parser.rule(null)
  static rule = (clazz) => new Parser(clazz)
  number = (clazz) => {
    this.elements.push(new AToken(clazz,"number"))
    return this
  }
  identifier = (reserved) => this.identifier2(null,reserved)
  identifier2 = (clazz, reserved) => {
    this.elements.push(new AToken(clazz, "id", reserved))
    return this
  }
  string = (clazz) => {
    this.elements.push(new AToken(clazz, "string"))
    return this
  }
  token = (pat) => {
    this.elements.push(new Leaf(pat));
    return this;
  }
  sep = (pat) => {
    // console.log("skip", pat)
    this.elements.push(new Skip(pat))
    return this;
  }
  ast = (p) => {
    // console.log("j:"+ p.constructor.name)
    this.elements.push(new Tree(p))
    return this
  }
  or = (p) => {
    this.elements.push(new OrTree(p))
    return this;
  }
  maybe = (p) => {
    let p2 = new Parser(p)
    p2.reset_blank()
    this.elements.push(new OrTree([new Parser(p), new Parser(p2)]))
    // console.log("maybe.p,p2", p,p2);
    return this;
  }
  option = (p) => {
    this.elements.push(new Repeat(p, true))
    return this
  }
  repeat = (p) => {
    this.elements.push(new Repeat(p, false))
    return this
  }
  expression = (clazz, subexp, operators) => {
    this.elements.push(new Expr(clazz, subexp, operators));
    return this;
  }
  insertChoice = (p) => {
    let e = this.elements[0]
    if (e instanceof OrTree) e.insert(p)
    else {
      let otherwise = new Parser(this);
      this.reset(null)
      this.or([p,otherwise]);
    }
    return this;
  }
}

export class Tree {
  parser;
  constructor(p) {
    this.parser=p
    // console.log("tree", p)
  }
  parse = (lexer, res) => {
    // console.log("tree.parse")
    res.push(this.parser.parse(lexer))
  }
  match = (lexer) => this.parser.match(lexer)
}

export class OrTree {
  parsers;
  constructor(p) {this.parsers=p}
  parse = (lexer, res) => {
    let i=0;
    // for (let p of this.parsers)
    //   console.log(++i,"ortree.parsers", p)
    let p=this.choose(lexer);
    // console.log("ortree.parse.choosed", p)
    if (p==null) {
      throw new Error("err")
    } else {
      // console.log("ortree.parse.else.res", res)
      res.push(p.parse(lexer));
    }
  }
  match = (lexer) => this.choose(lexer)!=null;
  choose = (lexer) => {
    // console.log("ortree.choose", lexer.constructor.name)
    let i=0;
    for (let p of this.parsers) {
      // console.log(++i, "ortree.choose", p)
      if (p.match(lexer)) {
        return p;
      }
    }
    return null;
  }
  insert = (p) => {
    // console.log("Ortree.insert", this.parsers, typeof this.parsers, p)
    let p0 = [p]
    this.parsers = p0.concat(this.parsers);
    // this.parsers.insert(0,0,p);
  }
}

export class Repeat {
  parser;
  onlyOnce;
  constructor(p,once) { this.parser=p,this.onlyOnce=once };
  parse = (lexer, res) => {
    while (this.parser.match(lexer)) {
      let t=this.parser.parse(lexer)
      // console.log("repeat.parse", t, t.constructor.name)
      if (t.constructor.name!="ASTList" || t.numChildren() > 0) {
        // console.log()
        res.push(t)
      }
      if (this.onlyOnce) break;
    }
  }
  match = (lexer) => this.parser.match(lexer)
}

export class Factory {
  make0;
  make = (arg) => {
    try {
      // console.log("factory.make", arg[0])
      return this.make0(arg)
    } catch(e) {
      throw new Error(e)
    }
  }
  static getForASTList = (clazz) => {
    let f=Factory.get(clazz, Array)
    if (f==null) {
      return new Factory(null)
    }
    return f;
  }
  static get = (clazz, argType) => {
    if (clazz==null) return null;
    // console.log(clazz.constructor.name, argType)
    return new Factory(clazz)
  }
  constructor(clazz) {
    if (clazz==null) {
      this.make0=(arg)=>{
        // console.log("make0:0", arg)
        return arg.length==1?arg[0]:new ASTList(arg);
      }
    }
    else  {
      let c = new clazz()
      if (c instanceof PrimaryExpr) {
        this.make0 = (arg) => {
          // console.log("inCreate", arg.length)
          return PrimaryExpr.create(arg);
        }
      } else {
        this.make0 = (arg) => {
          // console.log("clazzName", clazz, arg)
          return new clazz(arg);
        }
      }
    }
    // if (clazz.constructor.name =="PrimaryExpr") {// clazz==nullのときのやつ
    //   this.make0=(arg)=> {
    //     console.log("make0:1", arg)
    //     return arg.length==1?arg[0]:new PrimaryExpr(arg)
    //   }
    // } else {
    //   this.make0=(arg)=>{
    //     console.log("make0:2", arg, clazz.constructor.name, clazz)
    //     return new clazz(arg)
    //   }
    // }
  }
}

export class AToken {
  factory;
  tokenType;
  reserved=new Set();
  constructor(type, tokenType, r) {
    
    if (type == null) type = ASTLeaf
    this.factory=Factory.get(type, Token);
    this.tokenType=tokenType
    if (this.tokenType=="id" && r!= null)
      this.reserved=r;
  }
  parse=(lexer,res)=>{
    if (lexer.queue.length==0) return;
    // console.log("AToken.parse.lexer",lexer.constructor.name)
    let t=lexer.read()
    // console.log("AToken.parse.token",t)
    if (t.tokenType==this.tokenType) {
      if (this.tokenType!="id" || !this.reserved.has(t.value))
        res.push(this.factory.make(t))
    }
  }
  match = (lexer) => this.test(lexer.peek(0))
  test = (t) => {
    if (t == null) return false
    // console.log("AToken.test",t)
    return t.tokenType==this.tokenType && (this.tokenType != "id" || !this.reserved.has(t.value))
  }
}

export class Leaf {
  tokens
  constructor(pat) {this.tokens=pat}
  parse=(lexer,res)=>{
    let t=lexer.read()
    if (t == null) return false
    if (t.tokenType=="id") {
      for (let token of this.tokens) {
        if (token==t.value) {
          this.find(res,t);
          return;
        }
      }
    }
    if (this.tokens.length > 0) {
      // console.log(this.tokens[0] + " expected.", t)
    }
  }
  find = (res,t) => res.add(new ASTLeaf(t));
  match = (lexer) => {
    // console.log("leaf", lexer.constructor.name)
    let t=lexer.peek(0)
    if (t == null) return false
    // console.log("Leaf.match.peek", t)
    if (t.tokenType=="id")
      for (let token of this.tokens)
        if (t.value==token)
          return true;
    return false;
  }
}

export class Skip extends Leaf {
    constructor(t) {super(t)}
    find = (res, t) => {}
}

export class Precedence {
  value;
  leftAssoc;
  constructor(v,a) {
    this.value=v, this.leftAssoc=a;
  }
}

export class Operators extends Map {
  static LEFT = true;
  static RIGHT = false;
  add = (nm, prec, leftAssoc) => this.set(nm, new Precedence(prec, leftAssoc))
}

export class Expr {
  factory;
  ops;
  factor;
  constructor(clazz, exp, mp) {
    this.factory=Factory.getForASTList(clazz);
    this.ops=mp;
    this.factor=exp;
  }
  parse = (lexer, res) => {
    // console.log("Expr.parse.res", res)
    let right = this.factor.parse(lexer);
    let prec;
    while ((prec=this.nextOperator(lexer))!=null) {
      right = this.doShift(lexer,right,prec.value)
    }
    // console.log("Expr.parse.right", right)

    res.push(right)
  }
  nextOperator = (lexer) => {
    let t=lexer.peek(0);
    // console.log("nextOp", t)
    if (t==null) return null
    if (t.tokenType=="id") return this.ops.get(t.value)
    else return null
  }
  rightIsExpr = (prec, nextPrec) => {
    if (nextPrec.leftAssoc) return prec < nextPrec.value
    else return prec <= nextPrec.value
  }
  doShift=(lexer, left, prec)=>{
    let list=[];
    list.push(left);
    list.push(new ASTLeaf(lexer.read()))
    // console.log("doShift list", list)
    let right=this.factor.parse(lexer)
    let next;
    while ((next=this.nextOperator(lexer))!=null && this.rightIsExpr(prec, next))
      right=this.doShift(lexer,right,next.value)
    list.push(right)
    // console.log("doShift")
    return this.factory.make(list)
  }
  match = (lexer) => this.factor.match(lexer);
}

