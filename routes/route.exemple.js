module.exports = app => {
    const controller = require("../controllers/controller.exemple");
    const router = require('express').Router();

    // -- Welcome response
    router.get("/", controller.welcome);

    // -- Add URL to router
    app.use(`${config.global.API.URL}/exemple`, router);
}