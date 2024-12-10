import { HousePlug } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { Sheet,SheetTrigger, SheetContent} from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { shoppingViewHeaderMenuItems } from '../config';
import { Label } from '../ui/label';
import { ShoppingCart, UserCog, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import UserCartWrapper from './cart-wrapper';
import { logoutUser } from '../../store/auth-slice';
import { fetchCartItems } from '../../store/cart-slice';
import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';


function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
  <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
  {shoppingViewHeaderMenuItems.map((menuItem) => (
    <Label
      onClick={() => handleNavigate(menuItem)}
      className="text-sm font-medium cursor-pointer"
      key={menuItem.id}
    >
      {menuItem.label}
    </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cartItems} = useSelector((state) => state.cart);

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "sangam");

  return (
    <div className="flex items-center gap-2">
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper cartItems={cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []} setOpenCartSheet={setOpenCartSheet}/>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold cursor-pointer">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() { 
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-40 w-full boarder-b bg-backgroud">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
        <HousePlug className="h-6 w-6"/>
          <span className="font-bold">Ecommerce</span>
        </Link>
      <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden ml-auto">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems />
        </div>
        <div>
          <HeaderRightContent />
        </div>
      </div>
    </header>
  )
}

export default ShoppingHeader;
