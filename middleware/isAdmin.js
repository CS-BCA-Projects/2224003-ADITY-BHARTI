module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        console.log('User session:', req.session.user);
      next();
    } else {
      res.status(403).send('Access Denied: Admins Only');
    }
  };