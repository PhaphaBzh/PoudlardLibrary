const express = require("express");
const router = express.Router();
const twig = require("twig");
const authorController = require("../controllers/author.controller");

router.get("/:id", authorController.displayAuthor);
router.get("/", authorController.displayAuthors);
router.get("/modification/:id", authorController.updateAuthor);
router.post("/modificationServer", authorController.confirmAuthorUpdate);
router.post("/", authorController.addAnAuthor);
router.post("/delete/:id", authorController.deleteAnAuthor);

module.exports = router;