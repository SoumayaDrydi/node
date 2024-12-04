const mongoose = require('mongoose');

const BorrowedBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  returnDate: { type: Date, required: true },
  returned: { type: Boolean, default: false },
});

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
