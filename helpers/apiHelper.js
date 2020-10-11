function response (res, status, success, title, data) {
    return res.status(status).json({
        success: success,
        title: title,
        data: data,
    })
}

module.exports = {
    response,
}