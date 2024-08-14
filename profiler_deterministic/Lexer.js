//@ts-check

import fs from "fs"
import { Token } from "./Token.js"

export class Lexer {
  queue = [];
  regexPat = new RegExp("\\s*((//.*)|([0-9]+)|(\"(\\\\\"|\\\\\\\\|\\\\n|[^\"])*\")|([A-Z_a-z][A-Z_a-z0-9]*)|(==|<=|=>|<|=|>|&&|\\|\\||\\*|\\+|=|-|/|,|%|^|&|\\||\\(|\\)|;|\\.|\\{|\\}))?","g");
  constructor(filepath) {
    let text = fs.readFileSync(
      filepath,
      "utf-8"
    );
    const results = [...text.matchAll(this.regexPat)];
    for (let i of results) {
      // console.log(i)
      this.addToken(i);
    }
    // for (let q of this.queue) console.log(q)
  }
  addToken = (r) => {
    if (r[1]==undefined || r[2]!=undefined) return;
    // console.log("inside")
    let token;
    if (r[3]!=undefined) token = new Token("number", r[3]);
    else if (r[4]!=undefined) token = new Token("string", r[4]);
    else if (r[6]!=undefined) token = new Token("id", r[6]);
    else token = new Token("id", r[7]);// operator
    this.queue.push(token);
  }
  read = () => {
    if (this.queue.length==0) {
      return null
    } else {
      let t=this.queue[0]
      this.queue.shift()
      return t;
    }
  }
  peek = (i) => {
    if (i>=this.queue.length) return null
    return this.queue[i];
  }
} 