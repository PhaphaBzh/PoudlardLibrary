const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const twig = require("twig");
const bookController = require("../controllers/book.controller");

//Multer pour l'upload des images
const multer = require("multer");

//Configuration du stockage
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, "./public/images/")
    },
    filename: (request, file, cb) => {
        cb(null, Math.round(Math.random() * 10000) + "-" + file.originalname)
    }
})
//Accepter ou refuser les fichiers uploadés en fonction de leur type
const fileFilter = (request, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(new Error("l'image n'est pas acceptée", false))
    }
}
//Limtes de tailles de fichier
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get("/", bookController.display_books);

router.post("/",
    upload.single("bookImage"),
    [
        body('title').notEmpty().trim().escape(),
        body('author').notEmpty().trim().escape(),
        body('nbOfPages').notEmpty().trim().escape(),
        body('description').notEmpty().trim().escape(),
    ],
    async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).redirect('/livres');
        }
        bookController.add_a_book(request, response);
    });

router.get("/:id", bookController.displayBookDetails);
router.get("/modification/:id", bookController.updateBook);
router.post("/modificationServer", bookController.confirmBookUpdate);
router.post("/updateImage", upload.single("bookImage"), bookController.confirmBookImageUpdate);
router.post("/delete/:id", bookController.deleteABook);

module.exports = router;