import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddressCard from "@/components/shopping-list/address-card";
import CommonForm from "@/components/common/form";
import { addressFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, fetchAllAddresses, editaAddress, deleteAddress } from "@/store/address-slice";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";


const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  };
function Address() {
  const [selectedId, setSelectedId] = useState(null);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const {addressList} = useSelector((state) => state.address);
  const {user} = useSelector((state) => state.auth);


  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  console.log(formData, "formData");

  console.log(addressList, "addressList");

  return (
    <Card>
    <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
      {addressList && addressList.length > 0
        ? addressList.map((singleAddressItem) => (
            <AddressCard
            handleDeleteAddress={handleDeleteAddress}
            addressInfo={singleAddressItem}
            handleEditAddress={handleEditAddress}
            />
          ))
        : null}
    </div>
    <CardHeader>
      <CardTitle>
        {currentEditedId !== null ? "Edit Address" : "Add New Address"}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <CommonForm
        formControls={addressFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={currentEditedId !== null ? "Edit" : "Add"}
        onSubmit={handleManageAddress}
        isBtnDisabled={!isFormValid()}
      />
    </CardContent>
  </Card>
  )
}

export default Address
