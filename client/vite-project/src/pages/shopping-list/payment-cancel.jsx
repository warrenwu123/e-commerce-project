import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/store/order-slice";

// PayPal sends the buyer here with ?token=EC-... when they click
// "Cancel and return". Nothing was charged; we tell the server to mark the
// pending order as cancelled. The cart is left as it was.
function PaymentCancelPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const [status, setStatus] = useState("working"); // working | done | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    if (!orderId || !token) {
      // Nothing to cancel (e.g. page refreshed after it already ran).
      setStatus("done");
      return;
    }

    dispatch(cancelOrder({ orderId, token })).then((data) => {
      sessionStorage.removeItem("currentOrderId");
      if (data?.payload?.success) {
        setStatus("done");
      } else {
        setStatus("error");
        setMessage(data?.payload?.message || "Could not cancel the order.");
      }
    });
  }, [token, dispatch]);

  return (
    <Card className="m-5">
      <CardHeader>
        <CardTitle>
          {status === "working"
            ? "Cancelling your payment..."
            : status === "done"
            ? "Payment cancelled"
            : "Something went wrong"}
        </CardTitle>
      </CardHeader>
      {status !== "working" && (
        <CardContent className="space-y-4">
          <p>
            {status === "done"
              ? "You haven't been charged. Your cart items are still saved."
              : message}
          </p>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/shop/checkout")}>
              Back to checkout
            </Button>
            <Button variant="outline" onClick={() => navigate("/shop/account")}>
              View my orders
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default PaymentCancelPage;
