
//ייבוא טיפוסים ופונקציות
import express, { Express, Request, Response } from 'express'; //the types are between the parantasis

import userRouter from './users/user.routes';

//אתחול משתני סביבה
import 'dotenv/config';

//הגדרת הפורט (נקודת יציאה)
const PORT= process.env.PORT || 5555;

// האובייקט שמכיל את כל הדברים של השרת
const app: Express= express(); 

//יכולת קבלה ושליחה של ג'ייסון
app.use(express.json());

//יצירת ניתוב
app.get('/', async (req: Request, res: Response) => {

    res.status(200).send('Hello World from server!');
})

//שימוש בנתיבים של היוזרים

app.use('/api/users', userRouter);

// app.get('/hello', async (req: Request, res: Response) => {

//     console.log(req);
//     res.status(200).send('Hello');

// })


// //הוספה

// app.post('/add', async (req: Request, res: Response) => {

//     // console.log(req);
//     // res.status(201).send('added succefully');

//     if(!req.body.name){
//         res.status(500).send('The request body is empty');
//     }else{

//         res.status(201).send('added succefully');
//     }
// })

//הפעלת השרת
app.listen(PORT, ()=> console.log(`server started on port http://localhost:${PORT}`) );


//mongodb+srv://omeremily1:OU0aUgkSOMEoDPVu@sweatnsmile.dtwcavb.mongodb.net/?retryWrites=true&w=majority&appName=SweatNSmile