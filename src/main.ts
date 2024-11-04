import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import userRouter from './users/user.routes';
import productRouter from './products/product.routes';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5555;
const app: Express = express();

app.use(express.json());
app.use(cors()); //רשימת הכתובות שיכולות לגשת לשרת (אם זה ריק כולם יכולים לגשת)

app.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Hello World from server!');
});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);


app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
