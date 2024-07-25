import {Router} from 'express';

const rootRouter:Router = Router();
import authRoutes from './auth'
import productsRoutes from './product';
import usersRoutes from './users';
import cartRoutes from './cart';
import orderRoutes from './order';

rootRouter.use('/auth',authRoutes);
rootRouter.use('/products',productsRoutes);
rootRouter.use('/users', usersRoutes )
rootRouter.use('/carts', cartRoutes)
rootRouter.use('/orders', orderRoutes)

export default rootRouter;