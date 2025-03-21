import AddOrder from './components/OrderForm';
import UserOrders from './components/UserOrders';
import {ORDERS_ROUTE}  from './utils/consts';
export const publicRoutes = [
    {
     path: ORDERS_ROUTE,
     Component: AddOrder
    }, 
    {
     path: `${ORDERS_ROUTE}/:id`,
     Component: UserOrders
    }
   ];