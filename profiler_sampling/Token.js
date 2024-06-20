//@ts-check

export class Token {
  tokenType;
  value;
  static EOL="\\n"
  static EOF=null
  constructor (tokenType, value) {
    this.tokenType=tokenType;
    // console.log("inside", tokenType, value)
    if (tokenType=="number") {
      this.value = Number(value);
      // console.log("token is number", this.value)
      // console.log(this.value instanceof Number)
    }
    else this.value = value;
  }
}