const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const studentRoutes = require('./routes/studentRoutes');
const feesRoutes = require('./routes/feesRoutes');
const testRoutes = require('./routes/testRoutes');
const commonRoutes = require('./routes/commonRoutes');
const extraRoutes = require('./routes/extraRoutes');

app.use('/api/admin', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/tests', testRoutes);

app.use('/api/common', commonRoutes);
app.use('/api/extra', extraRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
