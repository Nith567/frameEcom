const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime-types');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"//NEXT_PUBLIC_URL
}));


const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.get('/api/test', (req,res) => {
  mongoose.connect("mongodb://localhost:27017");
  res.json('test osdfk');
});


app.post('/api/register', async (req, res) => {
  mongoose.connect("mongodb://localhost:27017");
  const { address } = req.body;

  try {
    // Check if a user with the same address already exists
    if (await User.findOne({ address })) {
      return res.status(400).json({ error: 'User with this address already exists' });
    }

    // Create a new user document with the provided address
    const userDoc = await User.create({
      address,
    });

    res.json(userDoc);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/ship', async (req, res) => {
  mongoose.connect("mongodb://localhost:27017");
  try {

    const { shippingAddress, address } = req.body;
console.log('so' , req);

const user = await User.findOne({ address });
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

user.shippingAddresses.push(shippingAddress);
    await user.save();
    res.status(200).send('Shipping address added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/orders/:address', async (req, res) => {

  mongoose.connect("mongodb://localhost:27017");
  try {

    const { address } = req.params; 
console.log('so' , req);
const user = await User.findOne({ address });

const shippingAddresses = user.shippingAddresses; 
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}
return res.json(shippingAddresses)
  } catch (err) {
    console.log('ere ');
    console.error(err);
    res.status(500).send('Server Error');
  }
});
