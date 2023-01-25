const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const token = req.header("x-access-token");

    if (!token) {
        return res.status(401).json({ msg: "", error: "Token invalid" })
    }

    try {
        const tokenVerify = jwt.verify(token, process.env.JWT_SECRETE)
        req.user = tokenVerify
        next()
    } catch (error) {
        res.status(403).json({ msg: "", error: "Access Denied" })
    }
}