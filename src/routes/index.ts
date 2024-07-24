import {Router} from 'express';

const rootRouter:Router = Router();
import authRoutes from './auth'
import productsRoutes from './product';
import usersRoutes from './users';

rootRouter.use('/auth',authRoutes);
rootRouter.use('/products',productsRoutes);
rootRouter.use('/users', usersRoutes )

export default rootRouter;