
function normalJSON(str){
  if (typeof str === 'string') {
    let reg = /^\w+\(({[^()]+})\)$/
    let matches = str.match(reg)
    
    const ret = JSON.parse(matches[1])
    return ret
  }
}






module.exports = normalJSON