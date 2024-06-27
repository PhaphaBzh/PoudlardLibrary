const express = require("express");
const router = express.Router();
const twig = require("twig");

router.get("/", (request, response) => {
    response.render("accueil.html.twig")
});

//Gestion des erreurs 404
router.use((request, response, suite) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    suite(error);
})

router.use((error, request, response) => {
    response.status(error.status || 500);
    response.end(error.message);
})

module.exports = router;