import {Router} from 'express';

const rootRouter:Router = Router();
import authRoutes from './auth'

rootRouter.use('/auth',authRoutes);

export default rootRouter;