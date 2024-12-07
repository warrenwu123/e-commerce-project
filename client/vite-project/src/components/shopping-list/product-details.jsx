import React from 'react'   
import { Dialog, DialogContent } from '../ui/dialog'
import StarRatingComponent from '../common/star-rating';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { StarIcon } from 'lucide-react';
import { setProductDetails } from '../../store/shop-slice';
import { useDispatch } from 'react-redux';

function ProductDetails({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const averageReview = 4.5
  console.log(productDetails, "productDetails");
  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
  };
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
    <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={productDetails?.image}
          alt={productDetails?.title}
          width={600}
          height={600}
          className="aspect-square w-full object-cover"
        />
      </div>
      <div className="">
        <div>
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
          {productDetails?.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold">Reviews</h2>
            <div className="grid items-center gap-2">
                <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                            SM
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold">Shubham</h3>
                        </div>
                        <div className="flex item-center gap-0.5">
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
          </div>
        </DialogContent>
    </Dialog>
  );
}

export default ProductDetails;
