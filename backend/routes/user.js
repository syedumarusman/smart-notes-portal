const Router = require("koa-router");
const controller = require("../controllers/user");
const auth = require("../utils/authMiddleware");

const router = new Router({
  prefix: "/user",
});

router.post("/login", controller.loginUser);

router.get("/", auth(["user", "admin"]), controller.getAll);

router.get("/:userId", auth(["user", "admin"]), controller.getUser);

router.post("/register", controller.registerUser);

router.put("/:userId", auth(["user", "admin"]), controller.update);

router.patch("/:userId/addAudioDetails", auth(["user", "admin"]), controller.addAudioLink)

router.post("/resetPassword", auth(["user"]), controller.resetPassword);

router.delete("/:userId", auth(["admin"]), controller.remove);

module.exports = router.routes();
