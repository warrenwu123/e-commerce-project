import { Route,Routes } from 'react-router-dom';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminOrders from './pages/admin-view/orders';
import AdminFeatures from './pages/admin-view/feature';
import AdminLayout from './components/admin-view/adminlayout';
import AdminProducts from './pages/admin-view/products';
import UnauthPage from './pages/unauth-pages';
import NotFound from "./pages/not-found";
import ShoppingHome from './pages/shopping-list/home';
import ShoppingLayout from './components/shopping-list/layout';
import ShoppingListing from './pages/shopping-list/listing';
import ShoppingAccount from './pages/shopping-list/account';
import ShoppingCheckout from './pages/shopping-list/checkout';
import PaypalReturnPage from './pages/shopping-list/paymentreturn';
import PaymentSuccessPage from './pages/shopping-list/paymentsuccess';
import SearchProducts from './pages/shopping-list/search';
import { Toaster } from './components/ui/toaster';
import CheckAuth from './components/common/check-auth';
import { checkAuth } from './store/auth-slice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Skeleton } from './components/ui/skeleton';
import PaymentReturnPage from './pages/shopping-list/paymentreturn';

function App() {

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
     <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }>
            <Route path="login" element={<AuthLogin/>} />
            <Route path="register" element={<AuthRegister/>}/>
          </Route>
          <Route path="/admin" element= {
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
            </CheckAuth>
          }>
            <Route path="dashboard" element={<AdminDashboard/>}/>
            <Route path="products" element={<AdminProducts/>}/>
            <Route path="orders" element={<AdminOrders/>}/>
            <Route path="features" element={<AdminFeatures/>}/>
          </Route>
          <Route path="/shop" element={
           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
           </CheckAuth>
          }>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="payment-return" element={<PaymentReturnPage />} />

          </Route>
          <Route path="*" element={<NotFound />}/>
          <Route path ="/auth-page" element = {<UnauthPage />} />
        </Routes>
        <Toaster/>
     </div>
  );
}

export default App;
