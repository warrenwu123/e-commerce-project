import React, { Fragment } from 'react'
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormElements } from '@/components/config';
import ProductImageUploaded from '@/components/admin-view/image-uploaded';
import { useState } from 'react';
import CommonForm from '@/components/common/form';
import { useDispatch } from 'react-redux';
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import AdminProductTile from '@/components/admin-view/product-tile';

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    types: "",
    size: "",
    colour:"",
    price:"",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
  };


function AdminProducts() {
  const {toast} = useToast();

  function onSubmit(event){
    event.preventDefault();
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "salePrice")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  };

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  

  const [openCreateProductsDialog,setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { Productlist } = useSelector((state) => state.adminProduct)
  const [SelectedCategory, setSelectedCategory] = useState(null)


  useEffect(() => {
    dispatch(fetchAllProducts()).then((response) => {
      console.log("fetchAllProducts response:", response);
    });
  }, [dispatch]);
  console.log(formData);
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
         Add new product 
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Productlist && Productlist.length > 0
          ? Productlist.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={() =>{ 
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
        setFormData(initialFormData);
      }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
          <SheetTitle>
           Add product
          </SheetTitle>
          </SheetHeader>
          <ProductImageUploaded 
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isEditMode={currentEditedId !== null}/>
          <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              isBtnDisabled={!isFormValid()}
              SelectedCategory = {SelectedCategory}
              setSelectedCategory = {setSelectedCategory}
            />
        </SheetContent>
      </Sheet>

    </Fragment>
  )
}

export default AdminProducts;
