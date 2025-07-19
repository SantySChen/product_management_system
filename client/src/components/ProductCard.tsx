import React, { useContext } from "react";
import {
  useAddToCartMutation,
  useDecreaseCartItemMutation,
  useGetCartItemQuantity,
} from "../hooks/cartHooks";
import { Card, Button, ButtonGroup, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/Product";
import { Store } from "../Store";
import { useQueryClient } from "@tanstack/react-query";
import type { Cart } from "../types/Cart";

interface Props {
  product: Product;
  quantity?: number;
  cartLoading?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, quantity, cartLoading }) => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const queryClient = useQueryClient();

  const { 
    data: quantityData = 0, 
    isLoading: isQuantityLoading,
    refetch: refetchQuantity, 
  } = useGetCartItemQuantity(product._id!);
  
  const actualQuantity = quantity !== undefined ? quantity : quantityData;
  const isLoading = cartLoading ?? isQuantityLoading

  const handleMutationSuccess = (updateCart: Cart) => {
    dispatch({ type: 'CART_UPDATE', payload: updateCart })
    queryClient.setQueryData(['cart'], updateCart)
    refetchQuantity();
  };

  const addToCart = useAddToCartMutation({ onSuccess: handleMutationSuccess });
  const decreaseCartItem = useDecreaseCartItemMutation({ onSuccess: handleMutationSuccess });

  const handleAdd = () => {
    addToCart.mutate({ productId: product._id!, quantity: 1 });
  };

  const handleIncrease = () => {
    if (actualQuantity < product.countInStock) {
      addToCart.mutate({ productId: product._id!, quantity: 1 });
    }
  };

  const handleDecrease = () => {
    if (actualQuantity > 0) {
      decreaseCartItem.mutate(product._id!);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${product._id}`);
  };

  return (
    <Card className="shadow-sm h-100">
      <Link to={`/product/${product._id}`}>
        <Image
          src={product.image}
          alt={product.name}
          className="card-img-top"
          style={{ objectFit: "cover", height: "200px" }}
          fluid
        />
      </Link>
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
            <Card.Title className="fs-5">{product.name}</Card.Title>
          </Link>
          <Card.Text className="text-muted">${product.price.toFixed(2)}</Card.Text>
        </div>

        {userInfo && (
          <div className="d-flex justify-content-between mt-3">
            {product.countInStock > 0 ? (
              isLoading ? (
                <Button variant="secondary" disabled>
                  Loading...
                </Button>
              ) : actualQuantity === 0 ? (
                <Button variant="success" onClick={handleAdd}>
                  Add
                </Button>
              ) : (
                <ButtonGroup>
                  <Button variant="outline-secondary" onClick={handleDecrease}>
                    -
                  </Button>
                  <Button variant="success" disabled>
                    {actualQuantity}
                  </Button>
                  <Button variant="outline-secondary" onClick={handleIncrease}>
                    +
                  </Button>
                </ButtonGroup>
              )
            ) : (
              <Button variant="outline-secondary" disabled>
                Out of Stock
              </Button>
            )}

            {userInfo.isManager && (
              <Button variant="outline-primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

