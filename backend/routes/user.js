const Router = require("koa-router");
const controller = require("../controllers/user");
const auth = require("../utils/authMiddleware");

const router = new Router({
  prefix: "/user",
});

// Login User
router.post("/login", controller.loginUser);

// Get All Users
router.get("/", auth(["user", "admin"]), controller.getAll);

// Get a User
router.get("/:userId", auth(["user", "admin"]), controller.getUser);

// Register New User
router.post("/register", controller.registerUser);

// Update a Specific User
router.put("/:userId", auth(["user", "admin"]), controller.update);

// Add Audio Details to a User
router.patch("/:userId/addAudioDetails", auth(["user", "admin"]), controller.addAudioFile)

// Add Audio Details to a User
router.patch("/:userId/addSummaryDetails", auth(["user", "admin"]), controller.addSummaryFile)

// Remove Audio Details
router.patch("/:userId/removeAudioDetails", auth(["user", "admin"]), controller.removeAudioFile)

// Remove Summary Details
router.patch("/:userId/removeSummaryDetails", auth(["user", "admin"]), controller.removeSummaryFile)

// Reset Password
router.post("/resetPassword", auth(["admin", "user"]), controller.resetPassword);

// Remove a User
router.delete("/:userId", auth(["admin", "user"]), controller.remove);

// Add a Feedback
router.post("/:userId/addFeedback", auth(["admin", "user"]), controller.addFeedback);

module.exports = router.routes();
