import {Router} from 'express';

const rootRouter:Router = Router();
import authRoutes from './auth'
import productsRoutes from './product';
import usersRoutes from './users';
import cartRoutes from './cart';

rootRouter.use('/auth',authRoutes);
rootRouter.use('/products',productsRoutes);
rootRouter.use('/users', usersRoutes )
rootRouter.use('/carts', cartRoutes)

export default rootRouter;