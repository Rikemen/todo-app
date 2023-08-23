const express = require('express');
const app = express();
const port = 3000;
const taskRoutes = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();
app.use(express.json());
app.use("/api/v1/tasks", taskRoutes);
app.use(express.static('./public'));



// データベースの接続
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(process.env.PORT || port, console.log(`Server running on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();
