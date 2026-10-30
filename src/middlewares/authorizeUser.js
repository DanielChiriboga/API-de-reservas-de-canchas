const authorizeUser = (req, res, next) => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "ID de usuario invalido"
    });
  }

  if (
    Number(req.user.id) !== userId &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({
      message: "No tienes permiso para consultar estas reservas"
    });
  }

  next();
};

module.exports = authorizeUser;