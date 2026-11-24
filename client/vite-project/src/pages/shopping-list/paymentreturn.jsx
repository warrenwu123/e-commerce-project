import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId || !payerId) {
      setError("Missing payment details from PayPal.");
      return;
    }
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

    // The server is idempotent, so a repeated call (refresh, StrictMode) is safe.
    dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
      if (data?.payload?.success) {
        sessionStorage.removeItem("currentOrderId");
        window.location.href = `${import.meta.env.BASE_URL}shop/payment-success`;
      } else {
        setError(
          data?.payload?.message || "We could not confirm your payment."
        );
      }
    });
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {error ? `Payment failed: ${error}` : "Processing Payment...Please wait!"}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
