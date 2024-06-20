export const sharedBuffer = new SharedArrayBuffer(3000*4)
export const sharedArray = new Int32Array(sharedBuffer)
export var funcDict = {}
var lastIdx = 0
export const processSharedArrayBuffer = (funcName, isAdd, uniqueId) => {
  if (isAdd) {
    let funcIdx = 0
    if (funcDict[funcName] != undefined) funcIdx = funcDict[funcName]
    else funcIdx = Object.keys(funcDict).length + 1, funcDict[funcName]=funcIdx
    Atomics.store(sharedArray, lastIdx++, funcIdx)
    Atomics.store(sharedArray, lastIdx++, uniqueId)
  }
  else {
    Atomics.store(sharedArray, --lastIdx, 0)
    Atomics.store(sharedArray, --lastIdx, 0)
  }
}
export const finishWorker = () => {
  Atomics.store(sharedArray, 0,-1)
}