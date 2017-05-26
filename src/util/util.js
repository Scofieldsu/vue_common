import moment from 'moment'

//  默认日期和时间戳的转换格式
let DEAULT_PATTERN = 'YYYY-MM-DD'

export default {
  // 时间戳转日期格式
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEAULT_PATTERN
      if (date === '') { // 判断时间戳输入是否为空
        return
      } else {
        // date时间戳格式为毫秒unix时间戳:1484236800000
        let dateTemp = moment(parseInt(date))
        let dateFormat = moment(dateTemp).format(pattern)
        return dateFormat
      }
    },
    formatUnix: function (date) {
      // date时间戳格式为中国标准时间---Thu Jan 12 2017 00:00:00 GMT+0800 (中国标准时间)
      // 饿了么时间组件的传输格式
      return date ? moment(date).format('x') : date
    }
  }
}
