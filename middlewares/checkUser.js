const jwt = require('jsonwebtoken');
require('dotenv').config();

function checkUser(req, res, next) {
  try{
    const authToken = req.headers['authorization'];
    // console.log(authToken);

    const authHeader = authToken && authToken.split(' ')[1];

    if(!authHeader)
      return res.status(401).json({message: "Invalid Token"});

    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, data)=>{
      if(err)
        return res.status(403).json({message: "Invalid Token"});
      req.user = data
      next();
    })
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports= {checkUser};