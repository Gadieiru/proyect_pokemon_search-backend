import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ 
      error: "Acceso denegado. No se proporcionó un token de seguridad." 
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = verified; 

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido o expirado. Por favor, inicia sesión de nuevo." 
    });
  }
};

export default verifyToken;