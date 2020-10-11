const Express = require('express')
const Router = Express.Router();
const Controller = require('../controllers/levelController')

// Router.post('/login', Controller.login)

Router.route('/')
    .get(Controller.list)
    .post(Controller.create)

Router.route('/:id')
    .get(Controller.find)
    .patch(Controller.update)
    .delete(Controller.delete)

module.exports = Router;