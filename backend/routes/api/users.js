const router = require("express").Router();

const userController = require("../../controllers/usersController");

// POST /users/register
router.post("/register", userController.userRegister);

// POST /users/login
router.post("/login", userController.userLogin);

// GET /verify/:JWT
router.get("/verify/:token/:UID", userController.verifyToken);

router.use("/cart", require("./cart"));

module.exports = router;
