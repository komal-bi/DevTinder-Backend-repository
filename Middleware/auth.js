const auth = (req, res, next) => {
  let reqUser = "xyz";
  let isAuthUser = reqUser == "xyz";
  if (isAuthUser) {
    next();
  } else {
    res.send("Not authenticated");
  }
};
module.exports = {
  auth,
};
