/**
 * Created by sheyude on 2017/5/7.
 */

const crypto = require('crypto');
const secret = "7(**&UHIHhs6%^&^*(^^88349329sj"
function hash(val) {
    const hash = crypto.createHmac('sha256', secret)
        .update(val)
        .digest('hex');
    return hash
}
module.exports.hash = hash;