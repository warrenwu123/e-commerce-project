import React from 'react'
import { useSelector } from 'react-redux'

function PaymentSuccessPage () {
  const { orderId } = useSelector((state) => state.shopOrder)
  console.log(orderId,"orderID")

  return (
    <div>
      payment successful
    </div>
  )
}

export default PaymentSuccessPage 
