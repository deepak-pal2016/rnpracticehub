const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', userRoutes);

module.exports = app;