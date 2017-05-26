// 公共方法

/*
  保存帐号信息到cookie
  cName(string): 保存的名称
  value(string): 保存的值
  expiredays(number): 缓存天数
*/
function cookieSave (cName, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
}

function cookieGet (cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) {
        cEnd = document.cookie.length
      }
      return unescape(document.cookie.substring(cStart, cEnd))
    }
    return null
  }
}

function cookieRemove (cName) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = cookieGet(cName)
  if (cval !== null) {
    document.cookie = cName + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

export default {
  cookieMaker: {
    save: cookieSave,
    get: cookieGet,
    remove: cookieRemove
  }
}
