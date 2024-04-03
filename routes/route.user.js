module.exports = app => {
    const controller = require("../controllers/controller.user");
    const router = require('express').Router();

    router.get("/", controller.all);
    router.post("/", controller.create);
    router.get("/:id", controller.read);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);

    // -- Add URL to router
    app.use(`${config.global.api.url}/user`, router);
}