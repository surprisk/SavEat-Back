module.exports = app => {
    const controller = require("../controllers/controller.security");
    const router = require('express').Router();

    router.post("/sign-in", controller.signIn);
    router.post("/sign-up", controller.signUp);
    router.post("/sign-out", controller.signOut);
    router.post("/refresh", controller.refresh);

    // -- Add URL to router
    app.use(`${config.global.API.URL}/security`, router);
}