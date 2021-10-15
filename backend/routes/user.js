const Router = require("koa-router");
const controller = require("../controllers/user");
const auth = require("../utils/authMiddleware");

const router = new Router({
  prefix: "/user",
});

router.post("/login", controller.loginUser);

router.get("/", controller.getAll);

router.get("/:userId", controller.getUser);

router.post("/", controller.registerUser);

router.put("/:userId", controller.update);

router.post("/resetPassword", controller.resetPassword);

router.delete("/:userId", auth(["admin"]), controller.remove);

module.exports = router.routes();
