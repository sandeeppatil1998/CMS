require('../../db/conn');

module.exports.logout = (req,res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/');
}

