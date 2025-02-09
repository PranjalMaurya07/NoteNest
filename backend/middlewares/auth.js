const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authHeaders = req.headers?.authorization;
  
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized user",
    });
  }

  const token = authHeaders.split(" ")[1]; 
  
  try {
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY); 
    req.user = verifyUser; 
    req.token = token; 
    next(); 
  } catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


module.exports = {
  auth
};
