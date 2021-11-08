const Router = require("koa-router");
const controller = require("../controllers/auth");

const router = new Router();

router.get("/checkAuthToken", controller.checkAuthToken);

router.post("/refreshToken", controller.refreshToken);

module.exports = router.routes();