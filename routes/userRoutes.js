const Express = require('express');
const Router = Express.Router();
const auth = require('../middlewares/auth')
const Controller = require('../controllers/userController')

Router.route('/')
    .get(auth.checkToken, Controller.list)
    .post(auth.checkToken, Controller.create)

Router.route('/login')
    .get(Controller.seed)
    .post(Controller.login)

Router.route('/:id')
    .get(auth.checkToken, Controller.find)
    .patch(auth.checkToken, Controller.update)
    .delete(auth.checkToken, Controller.remove)

module.exports = Router;
