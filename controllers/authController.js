function register(req, res, next) {

}

function login(req, res, next) {
  return res.json({ msg: 'Success' });
}

module.exports = {
  register,
  login
};
