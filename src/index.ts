import express,{Express,Request,Response} from 'express';
import { PORT } from './secrets';
const app:Express = express();
import rootRouter from './routes/index';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/error';

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use('/api',rootRouter);

export const prismaClient = new PrismaClient({
    log:['query']
})

app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});

 
