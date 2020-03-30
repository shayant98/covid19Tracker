const mcache = require("memory-cache");

const cache = duration => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.originalUrl
        let cacheBody = mcache.get(key)
        if (cacheBody) {
            res.send(cacheBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000)
                res.sendResponse(body)
            }
            next()
        }
    }
}

module.exports = cache