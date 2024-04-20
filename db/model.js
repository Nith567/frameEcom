const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  address: String,
  shippingAddresses: [String]
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;