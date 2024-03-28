module.exports = app => {
    const controller = require("../controllers/controller.notFound");
    const router = require('express').Router();

    // -- 404 Not found
    router.get("*", controller.notFound);

    // -- Add URL to router
    app.use(`${config.global.API.URL}/`, router);
}