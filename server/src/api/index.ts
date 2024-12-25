import express from 'express';
import { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { cleanDataForCities } from "../utils/utils"; // Ensure this module is typed
import { config } from "dotenv";
import { JsonObjectExpression } from 'typescript';

/* Load environment variables */
config();
// process.env.PORT || 3000;
const app: Express = express();
const PORT: string | undefined | Number = 3000;
const dbPath = path.join("/Users/shonsalomonvitch/Desktop/finalProject/backend/src/data/DB.json");

/* Adding default data of cities if there is not */
/* When will be client try to trigger from there by POST */
const getInitialData = async () => {
    const citiesDataFromDB = fs.readFileSync(dbPath, { encoding: "utf-8" });
    if (citiesDataFromDB.length === 0) {
        try {
            const newData = await cleanDataForCities([
                "tel-aviv",
            ]);
            fs.writeFileSync(dbPath, JSON.stringify(newData));
            console.log("Writing dedfault data into DB");
        } catch (error) {
            console.error(error);
        }
    }
}

getInitialData();

type ApiResponse = {
    isSuccess: boolean;
    data: string;
    message: string;
}

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Url request: ${req.url}`);
    next();
};

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(logger);


/* Getting cities from DB */
app.get("/", (req: Request, res: Response) => {
    console.log('Get method running');
    const citiesDataFromDB = fs.readFileSync(dbPath, { encoding: "utf-8" });
    if (citiesDataFromDB.length === 0) {
        res.status(404).send({
            isSuccess: false,
            data: '',
            message: `No cities were found`,
        });
    } else {
        res.status(200).json({
            isSuccess: true,
            data: citiesDataFromDB,
            message: 'Cities data',
        });
    }
});

/* Add city to DB */
app.post("/", async (req: Request, res: Response) => {
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
    const citiesDataFromDB = JSON.parse(
        fs.readFileSync(dbPath, { encoding: "utf-8" })
    );
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
        const newData = await cleanDataForCities([cityToAdd]);
        
        if (!newData) {
            res.status(404).send({
                isSuccess: false,
                data: '',
                message: `Sorry, ${cityToAdd} is not exist`,
            });
            return;

        }
        newData?.forEach((data) => {
            citiesDataFromDB.push(data);
            fs.writeFileSync(dbPath, JSON.stringify(citiesDataFromDB));
            res.status(201).send({
                isSuccess: true,
                data: JSON.stringify(data),
                message: `${cityToAdd} added successfully`,
            });
            return;

        });
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            data: "",
            message: "Internal Server Error",
        });
    };
});

/* Deleting city from DB */
app.delete("/:city", (req: Request, res: Response) => {
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

    const citiesDataFromDB = JSON.parse(
        fs.readFileSync(dbPath, { encoding: "utf-8" })
    );

    if (citiesDataFromDB.length <= 1) {
        res.status(405).send({
            isSuccess: false,
            data: '',
            message: `Cannot delete ${city}`,
        });
        return;
    }

    for (let index = 1; index < citiesDataFromDB.length; index++) {
        if (
            citiesDataFromDB[index].cityName
                .toLowerCase()
                .replace("-", " ")
                .includes(city)
        ) {
            citiesDataFromDB.splice(index, 1);
            fs.writeFileSync(dbPath, JSON.stringify(citiesDataFromDB));
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
