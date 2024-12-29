import React from 'react'   
import { Dialog, DialogContent } from '../ui/dialog'
import StarRatingComponent from '../common/star-rating';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { StarIcon } from 'lucide-react';
import { setProductDetails } from '../../store/shop-slice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addToCart, fetchCartItems } from '../../store/cart-slice';
import { toast } from '../../hooks/use-toast';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { addReview, getReviews } from '../../store/review-slice';


function ProductDetails({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();   
  const { cartItems } = useSelector((state) => state.cart);
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const { reviews } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.auth);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  console.log(productDetails, "productDetails");
  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
  };

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddReview() {
    if(rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })).then((data) => {
        console.log(data,"data")
        if (data.payload?.success) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails?._id));
          toast({
            title: "Review added successfully!",
          }); 
        } else {
          toast({
            title: "You can't review this product since you didn't buy it",
            variant: "destructive",
          });
        }
     });
  }

  const averageReview =
  reviews && reviews.length > 0
    ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length
    : 0;



    return (
      <Dialog open={open} onOpenChange={handleDialogClose} className = "overflow-auto">
        <DialogContent className="overflow-auto grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[50vw]">
            <div className="flex flex-col relative rounded-lg items-center">
              <img
                src={productDetails?.image}
              alt={productDetails?.title}   
              className="aspect-square h-full w-full object-fill "
            />
          </div>    
          <div className="flex flex-col h-auto relative rounded-lg">
            <div>
              <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
              <p className="text-sm mb-5 mt-4">
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
          </div>
            <div className="max-h-[300px] overflow-auto col-span-2">
            <Separator className="w-full"/>
              <h2 className="text-xl font-bold mb-4 items-center">Reviews</h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>  
                        <p className="text-muted-foreground">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Reviews</h1>
                )}
              </div>
              <div className="mt-10 flex-col flex gap-2">
                <Label>Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                >
                  Submit
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
    );
}

export default ProductDetails;
