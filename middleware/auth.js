const jwt = require("jsonwebtoken");
const adminConfig = require("../config/admin");

function generateToken(payload) {
  return jwt.sign(payload, adminConfig.jwtSecret, { expiresIn: "1h" });
}

function verifyTokenFromRequest(req) {
  // Try cookie first, then Authorization header
  const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) return null;
  try {
    return jwt.verify(token, adminConfig.jwtSecret);
  } catch (err) {
    return null;
  }
}

function isAdmin(req, res, next) {
  const payload = verifyTokenFromRequest(req);
  if (payload && payload.username === adminConfig.username) {
    // attach admin info to request if needed
    req.admin = payload;
    return next();
  }
  // fallback to session if present (backwards compatible)
  if (req.session && req.session.isAdmin) return next();

  // if request accepts json, send 401 json, otherwise redirect to login
  if (req.xhr || req.headers.accept && req.headers.accept.indexOf("json") !== -1) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.redirect("/login");
}

module.exports = {
  generateToken,
  isAdmin,
  verifyTokenFromRequest,
};
