const express = require('express');

const Book = require('../models/book');
const Group = require('../models/group');

const router = express.Router();

// Retrieve all book-related groups from the data base.
router.get('/:bookId/groups', (req, res, next) => {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    let groups = [];
    let counter = 0;
    if (book.groups.length !== 0) {
      book.groups.forEach((groupId) => {
        Group.findOne({ _id: groupId }).then((group) => {
          groups.push(group);
          counter += 1;
          if (counter === book.groups.length) {
            if (book.groups.length !== 0) {
              res.send(groups);
            }
          }
        });
      });
    } else {
      res.send([]);
    }
  }).catch(next);
});

// Retrieve a specific book-related group from the data base.
router.get('/:bookId/groups/:groupId', (req, res, next) => {
  Group.findOne({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
});

// Create a book-related group and save it inside the data base.
router.post('/:bookId/groups', (req, res, next) => {
  Group.create(req.body).then((group) => {
    Book.findOne({ _id: req.params.bookId }).then((book) => {
      book.update({ contacts: book.groups.concat(group._id) }).then(() => {
        res.send(group);
      });
    });
  }).catch(next);
});

// Update a specific book-related group inside the data base.
router.put('/:bookId/groups/:groupId', (req, res, next) => {
  Group.findOneAndUpdate({ _id: req.params.groupId }, { runValidators: true }, req.body)
    .then(() => {
      Group.findOne({ _id: req.params.groupId }).then((group) => {
        res.send(group);
      });
    }).catch(next);
});

// Delete a specific book-related group from the data base.
router.delete('/:bookId/groups/:groupId', (req, res, next) => {
  Group.findByIdAndRemove({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
});

/* // Not working.
// Add a group to a contact.
router.post('/:bookId/groups/:groupId/:contactId', (req, res, next) => {
  Contact.findById({ _id: req.params.contactId }).then((contact) => {
    console.log(contact);
    var currentGroups = contact.groups;
    console.log(contact.groups);
    Group.findById({ _id: req.params.groupId }).then((group) => {
      console.log(group)
      if (currentGroups.includes(group) === false) {
      contact.update({ groups: currentGroups.concat(group) }).then(() => {
        Contact.findOne({ _id: req.params.contactId }).then((updatedContact) => {
          res.send(updatedContact);
        });
      });
      }
    });
  });
}); */

module.exports = router;
