const mongoose = require("mongoose");
const fs = require("fs");
const authorModel = require("../models/author.model");
const bookModel = require("../models/book.model")
const { log } = require("console");

exports.displayAuthor = (request, response) => {
    authorModel.findById(request.params.id)
        .populate("books")
        .exec()
        .then(author => {
            console.log(author);
            response.render("auteurs/auteur.html.twig", { author: author, isModification: false });
        })
        .catch(error => {
            console.error(error);
        });
};

exports.displayAuthors = (request, response) => {
    authorModel.find()
        .populate("books")
        .exec()
        .then(authors => {
            response.render("auteurs/liste.html.twig", { authors: authors });
        })
        .catch(error => {
            console.error(error);
        });
};

exports.addAnAuthor = (request, response) => {
    const author = new authorModel({
        _id: new mongoose.Types.ObjectId(),
        lastName: request.body.lastName,
        firstName: request.body.firstName,
        age: request.body.age
    });
    author.save()
        .then(result => {
            console.log(result);
            response.redirect("/auteurs")
        })
        .catch(error => {
            console.error(error);
        })
};

exports.deleteAnAuthor = (request, response) => {
    const author = authorModel.findById(request.params.id)
        .then(author => {
            return bookModel.deleteMany({ author: author._id })
                .then(
                    authorModel.deleteOne({ _id: request.params.id })
                        .then(() => {
                            request.session.message = {
                                type: 'success',
                                content: 'Suppression effectuée'
                            }
                            response.redirect("/auteurs");
                        })
                )
        })
        .catch(error => {
            console.error(error);
        })
}

exports.updateAuthor = (request, response) => {
    bookModel.find()
        .exec()
        .then(books => {
            authorModel.findById(request.params.id)
                .then(author => {
                    response.render("auteurs/auteur.html.twig", {
                        author: author,
                        listOfBooks: books,
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
}

exports.confirmAuthorUpdate = (request, response) => {
    const authorUpdated = {
        $set: {
            lastName: request.body.lastName,
            firstName: request.body.firstName,
            age: request.body.age
        },
    }
    authorModel.updateOne({ _id: request.body.authorId }, authorUpdated)
        .then(result => {
            if (result.modifiedCount < 1) throw new Error("La modification a échoué");
            request.session.message = {
                type: 'success',
                content: 'Modification effectuée'
            }
            response.redirect("/auteurs");
        })
        .catch(error => {
            console.error(error);
            request.session.message = {
                type: 'danger',
                content: error.message
            }
            response.redirect("/auteurs");
        })
}
