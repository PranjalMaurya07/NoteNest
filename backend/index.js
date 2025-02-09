// Requirements
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectMongoDB } = require('./config/connection');
const app = express();

const userRouter = require('./routes/userRoutes');
const notesRouter = require('./routes/notesRoutes');
const manageNotesRouter = require('./routes/manageNotes')

// Connect-database
connectMongoDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/auth',userRouter);
app.use('/api',notesRouter);
app.use('/api/notes',manageNotesRouter);

// Connect-to-server
const port = process.env.PORT || 8001;
app.listen(port,()=>{
    console.log(`Server running in ${process.env.DEV_MODE} mode on port ${port}`);
});
