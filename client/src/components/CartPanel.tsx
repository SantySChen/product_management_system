import React, { useContext, useState } from "react";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useDecreaseCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
  useApplyDiscountMutation,
} from "../hooks/cartHooks";
import { Store } from "../Store";
import type { Cart } from "../types/Cart";
import { Button, ButtonGroup } from "react-bootstrap";

type CartPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { data: cart, refetch, isLoading } = useGetCartQuery();

  const cartItems = cart?.cartItems ?? [];

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");

  const handleSuccess = (data: Cart) => {
    dispatch({ type: "CART_UPDATE", payload: data });
    refetch(); 
  };

  const addToCart = useAddToCartMutation({ onSuccess: handleSuccess });
  const decreaseItem = useDecreaseCartItemMutation({
    onSuccess: handleSuccess,
  });
  const removeItem = useRemoveCartItemMutation({ onSuccess: handleSuccess });
  const { mutate: checkout } = useCheckoutMutation({
    onSuccess: handleSuccess,
  });
  const { mutate: applyDiscount } = useApplyDiscountMutation({
    onSuccess: (data: Cart) => {
      handleSuccess(data);
      setDiscountError(""); // clear any error
    },
    onError: () => {
      setDiscountError("Invalid discount code.");
    },
  });

  const handleDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim()) {
      applyDiscount({ code: discountCode.trim() });
    }
  };

  const totalItems = userInfo ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <div
      className={`position-fixed top-0 end-0 p-3`}
      style={{
        width: "350px",
        zIndex: 1055,
        transition: "transform 0.3s ease",
        transform: isOpen ? "translateX(0)" : "translateX(120%)",
      }}
    >
      <div className="card shadow h-100 d-flex flex-column">
        {/* Header */}
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span className="fw-bold">Cart ({totalItems})</span>
          <button
            className="btn btn-sm btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        {/* Body */}
        <div className="card-body d-flex flex-column flex-grow-1 overflow-hidden p-3">
          {/* Product List */}
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {!userInfo ? (
              <div className="text-center text-muted mt-3">
                Please sign in first to view your cart.
              </div>
            ) : isLoading ? (
              <div className="text-center text-muted mt-3">Loading...</div>
            ) : cartItems.length === 0 ? (
              <div className="text-center text-muted mt-3">
                Your Cart is empty.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product}
                  className="d-flex gap-2 border-bottom pb-2 mb-2"
                >
                  <img
                    src={item.image ?? ""}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded"
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <strong>{item.name}</strong>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <div className="d-flex align-items-center gap-2">
                        {item.quantity === 0 ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              addToCart.mutate({
                                productId: item.product,
                                quantity: 1,
                              })
                            }
                          >
                            Add
                          </Button>
                        ) : (
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-secondary"
                              onClick={() => decreaseItem.mutate(item.product)}
                            >
                              -
                            </Button>
                            <Button variant="success" disabled>
                              {item.quantity}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                addToCart.mutate({
                                  productId: item.product,
                                  quantity: 1,
                                })
                              }
                            >
                              +
                            </Button>
                          </ButtonGroup>
                        )}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem.mutate(item.product)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount Input */}
          {userInfo && (
            <form className="mt-3" onSubmit={handleDiscountSubmit}>
              <label htmlFor="discountCode" className="mb-2 fw-semibold">Apply Discount Code</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  id="discountCode"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-primary">Apply</button>
              </div>
              {discountError && <div className="text-danger mt-2">{discountError}</div>}
            </form>
          )}

          {/* Summary */}
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>
                ${cart?.subTotal?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Tax:</span>
              <span>${cart?.tax?.toFixed(2) ?? "0.00"}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Discount:</span>
              <span>
                -${cart?.discount?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Estimated Total:</span>
              <span>
                ${cart?.totalPrice?.toFixed(2) ?? "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer bg-white border-0">
          <button 
          onClick={() => checkout()} 
          className="btn btn-primary w-100"
          disabled={!userInfo || cartItems.length === 0}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
