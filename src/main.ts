import express, { Express, Request, Response } from 'express';
import userRouter from './users/user.routes';
import 'dotenv/config';
import cors from 'cors';

const PORT = process.env.PORT || 5555;
const app: Express = express();

app.use(express.json());
app.use(cors()); //רשימת הכתובות שיכולות לגשת לשרת (אם זה ריק כולם יכולים לגשת)

app.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Hello World from server!');
});

app.use('/api/users', userRouter);

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
