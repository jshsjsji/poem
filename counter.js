// 大写汉语数字映射
const CN_NUM = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

/**
 * 将阿拉伯数字转为大写汉语数字
 * @param {number} num
 * @returns {string}
 */
function toChineseNum(num) {
    if (num < 0 || num > 9) return String(num); // 简单处理，超出范围直接返回
    return CN_NUM[num];
}