"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const shop_items_1 = require("./models/shop-items");
const order_1 = require("./models/order");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.MONGO);
        console.log('Подключились к БД');
    }
    catch (err) {
        console.error('Ошибка подключения к БД:', err);
        process.exit(1);
    }
});
connectDB();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get('/api/shop-items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getItems = yield shop_items_1.Items.find().sort({ id: 1 });
        if (!getItems)
            throw new Error("Товар не найден");
        res.status(200).send(getItems);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}));
app.get('/api/shop-items/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getItem = yield shop_items_1.Items.findOne({ id: req.params.id });
        if (!getItem)
            throw new Error("Товар не найден");
        res.status(200).send(getItem);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}));
app.post('/api/shop-items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_1.Order.insertMany(req.body);
        if (!result)
            throw new Error("Товар не найден");
        res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}));
app.post('/api/shop-items/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield shop_items_1.Items.find({ $text: { $search: req.body.search } });
        if (!result)
            throw new Error("Товар не найден");
        res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}));
app.listen(config_1.PORT, () => console.log('Сервер запущен'));
