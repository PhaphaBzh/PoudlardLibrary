const bookModel = require("../models/book.model");
const authorModel = require("../models/author.model");
const mongoose = require("mongoose");
const fs = require("fs");

exports.display_books = (request, response) => {
    authorModel.find()
        .exec()
        .then(authors => {
            bookModel.find()
                .populate("author")
                .exec()
                .then(books => {
                    response.render("livres/liste.html.twig", {
                        listOfBooks: books,
                        listOfAuthors: authors,
                        message: response.locals.message
                    });
                })
                .catch(error => {
                    console.error(error)
                });
        })
        .catch(error => {
            console.error(error);
        })
};

exports.displayBookDetails = (request, response) => {
    bookModel.findById(request.params.id)
        .populate("author")
        .exec()
        .then(book => {
            response.render("livres/livre.html.twig", { book: book, isModification: false })
        })
        .catch(error => {
            console.error(error);
        })
};

exports.add_a_book = (request, response) => {
    const book = new bookModel({
        _id: new mongoose.Types.ObjectId(),
        title: request.body.title,
        author: request.body.author,
        nbOfPages: request.body.nbOfPages,
        description: request.body.description,
        image: request.file.path.substring(14)
    });
    book.save()
        .then(result => {
            request.session.message = {
                type: 'success',
                content: 'Ajout effectué'
            }
            console.log(result);
            response.redirect("/livres")
        })
        .catch(error => {
            console.error(error);
        })
};

exports.updateBook = (request, response) => {
    authorModel.find()
        .exec()
        .then(authors => {
            bookModel.findById(request.params.id)
                .populate("author")
                .exec()
                .then(book => {
                    response.render("livres/livre.html.twig", {
                        book: book,
                        listOfAuthors: authors,
                        isModification: true
                    })
                })
                .catch(error => {
                    console.error(error);
                })
        })
        .catch(error => {
            console.error(error);
        })
};

exports.confirmBookUpdate = (request, response) => {
    const bookUpdated = {
        $set: {
            title: request.body.title,
            author: request.body.author,
            nbOfPages: request.body.nbOfPages,
            description: request.body.description
        },
    }
    bookModel.updateOne({ _id: request.body.bookId }, bookUpdated)
        .then(result => {
            if (result.modifiedCount < 1) throw new Error("La modification a échoué");
            request.session.message = {
                type: 'success',
                content: 'Modification effectuée'
            }
            response.redirect("/livres");
        })
        .catch(error => {
            console.error(error);
            request.session.message = {
                type: 'danger',
                content: error.message
            }
            response.redirect("/livres");
        })
};

exports.confirmBookImageUpdate = (request, response) => {
    //on récupère l'image à modifier
    let book = bookModel.findById(request.body.bookId)
        .select("image")
        .exec()
        .then(book => {
            fs.unlink("./public/images/" + book.image, error => {
                console.error(error);
            })
            const bookImageToUpdate = {
                $set: {
                    image: request.file.path.substring(14)
                }
            }
            bookModel.updateOne({ _id: request.body.bookId }, bookImageToUpdate)
                .then(result => {
                    if (result.modifiedCount < 1) throw new Error("La modification a échoué");
                    request.session.message = {
                        type: 'success',
                        content: 'Modification effectuée'
                    }
                    response.redirect("/livres/modification/" + request.body.bookId)
                })
                .catch(error => {
                    console.error(error);
                })
        });
};

exports.deleteABook = (request, response) => {
    //on récupère l'image à supprimer
    let book = bookModel.findById(request.params.id)
        .select("image")
        .exec()
        .then(book => {
            fs.unlink("./public/images/" + book.image, error => {
                console.error(error);
            })
            bookModel.deleteOne({ _id: request.params.id })
                .then(result => {
                    request.session.message = {
                        type: 'success',
                        content: 'Suppression effectuée'
                    }
                    response.redirect("/livres");
                })
                .catch(error => {
                    console.error(error);
                })
        })
        .catch(error => {
            console.error(error);
        })
};