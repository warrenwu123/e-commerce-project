  import React from 'react'
  import { Card,CardTitle,CardHeader,CardContent} from '../ui/card';
  import {   
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '../ui/table';
  import { Badge } from '../ui/badge';
  import { Button } from '../ui/button';
  import { Dialog } from '../ui/dialog';
  import { useState } from 'react';
  import { useDispatch } from 'react-redux';
  import ShoppingOrderDetailsView  from './order-details';
  import { useSelector } from 'react-redux';
  import { getOrderDetails, getAllOrdersByUserId } from '../../store/order-slice';
  import { useEffect } from 'react';


function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");
  console.log(orderList,"orderList")


   return (
    <Card>
    <CardHeader>
      <CardTitle>Order History</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Order Price</TableHead>
            <TableHead>
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList && orderList.length > 0
            ? orderList.map((orderItem) => (
                <TableRow>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>{orderItem?.orderDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                      }}
                    >
                      <Button
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                      >
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
}

export default ShoppingOrders;
