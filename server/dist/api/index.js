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
const cors_1 = __importDefault(require("cors"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const utils_1 = require("../utils/utils"); // Ensure this module is typed
const dotenv_1 = require("dotenv");
/* Load environment variables */
(0, dotenv_1.config)();
// process.env.PORT || 3000;
const app = (0, express_1.default)();
const PORT = 3000;
const dbPath = node_path_1.default.join("/Users/shonsalomonvitch/Desktop/whether project/server/src/data/DB.json");
/* Adding default data of cities if there is not */
/* When will be client try to trigger from there by POST */
const getInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    const citiesDataFromDB = node_fs_1.default.readFileSync(dbPath, { encoding: "utf-8" });
    if (citiesDataFromDB.length === 0) {
        try {
            const newData = yield (0, utils_1.cleanDataForCities)([
                "tel-aviv",
            ]);
            node_fs_1.default.writeFileSync(dbPath, JSON.stringify(newData));
            console.log("Writing dedfault data into DB");
        }
        catch (error) {
            console.error(error);
        }
    }
});
getInitialData();
const logger = (req, res, next) => {
    console.log(`Url request: ${req.url}`);
    next();
};
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use(logger);
/* Getting cities from DB */
app.get("/", (req, res) => {
    console.log('Get method running');
    const citiesDataFromDB = node_fs_1.default.readFileSync(dbPath, { encoding: "utf-8" });
    if (citiesDataFromDB.length === 0) {
        res.status(404).send({
            isSuccess: false,
            data: '',
            message: `No cities were found`,
        });
    }
    else {
        res.status(200).json({
            isSuccess: true,
            data: citiesDataFromDB,
            message: 'Cities data',
        });
    }
});
/* Add city to DB */
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Post method running');
    let { city } = req.body;
    if (!city) {
        res.status(400).send({
            isSuccess: false,
            data: '',
            message: `${city} 'parameter is required'`,
        });
        return;
    }
    const cityToAdd = city;
    const citiesDataFromDB = JSON.parse(node_fs_1.default.readFileSync(dbPath, { encoding: "utf-8" }));
    city = city.replace("-", " ").toLowerCase();
    for (const element of citiesDataFromDB) {
        if (element.cityName.toLowerCase().replace("-", " ").includes(city)) {
            res.status(409).send({
                isSuccess: false,
                data: '',
                message: `${city} already been added to DB`,
            });
            return;
        }
    }
    if (citiesDataFromDB.length >= 8) {
        res.status(507).send({
            isSuccess: false,
            data: '',
            message: `8 cities already been added no more space`,
        });
        return;
    }
    try {
        const newData = yield (0, utils_1.cleanDataForCities)([cityToAdd]);
        if (!newData) {
            res.status(404).send({
                isSuccess: false,
                data: '',
                message: `Sorry, ${cityToAdd} is not exist`,
            });
            return;
        }
        newData === null || newData === void 0 ? void 0 : newData.forEach((data) => {
            citiesDataFromDB.push(data);
            node_fs_1.default.writeFileSync(dbPath, JSON.stringify(citiesDataFromDB));
            res.status(201).send({
                isSuccess: true,
                data: JSON.stringify(data),
                message: `${cityToAdd} added successfully`,
            });
            return;
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            data: "",
            message: "Internal Server Error",
        });
    }
    ;
}));
/* Deleting city from DB */
app.delete("/:city", (req, res) => {
    console.log('Delete method running');
    let { city } = req.params;
    const cityToSend = city;
    city = city.replace("-", " ").toLowerCase();
    if ("tel aviv yafo".includes(city)) {
        res.status(403).send({
            isSuccess: false,
            data: '',
            message: `Cannot delete default city`,
        });
        return;
    }
    const citiesDataFromDB = JSON.parse(node_fs_1.default.readFileSync(dbPath, { encoding: "utf-8" }));
    if (citiesDataFromDB.length <= 1) {
        res.status(405).send({
            isSuccess: false,
            data: '',
            message: `Cannot delete ${city}`,
        });
        return;
    }
    for (let index = 1; index < citiesDataFromDB.length; index++) {
        if (citiesDataFromDB[index].cityName
            .toLowerCase()
            .replace("-", " ")
            .includes(city)) {
            citiesDataFromDB.splice(index, 1);
            node_fs_1.default.writeFileSync(dbPath, JSON.stringify(citiesDataFromDB));
            res.status(204).send({
                isSuccess: true,
                data: '',
                message: `${cityToSend} deleted successfully`,
            });
            return;
        }
    }
    res.status(404).send({
        isSuccess: false,
        data: '',
        message: `${cityToSend} is not in DB`,
    });
});
app.listen(PORT, () => {
    console.log(`App is listen to PORT: ${PORT}`);
});
/* Make delete button responsive(delete http in client and server) */
