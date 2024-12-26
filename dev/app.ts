import express, { Application, Request, Response } from "express";
import mongoose, { models } from "mongoose";
import { MONGO, PORT } from "./config";
import { Items } from "./models/shop-items";
import { Order } from "./models/order";
import cors from "cors";
import bodyParser from "body-parser";

const connectDB = async () => { 
    try { 
        await mongoose.connect(MONGO); 
        console.log('Подключились к БД'); 
    } catch (err) { 
        console.error('Ошибка подключения к БД:', err); 
        process.exit(1); 
    }
};

connectDB();

const app: Application = express();
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/api/shop-items', async (req: Request, res: Response) => {
    try {
        const getItems = await Items.find().sort({id: 1});
        if (!getItems) throw new Error("Товар не найден");
        res.status(200).send(getItems);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/api/shop-items/:id', async (req: Request, res: Response) => {
    try {
        const getItem = await Items.findOne({id: req.params.id});
        if (!getItem) throw new Error("Товар не найден");
        res.status(200).send(getItem);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/api/shop-items', async (req: Request, res: Response) => {
    try {
        const result = await Order.insertMany(req.body);
        if (!result) throw new Error("Товар не найден");
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/api/shop-items/search', async (req: Request, res: Response) => {
    try {
        const result = await Items.find({$text: {$search: req.body.search}});
        if (!result) throw new Error("Товар не найден");
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.listen(PORT, () => console.log('Сервер запущен'));