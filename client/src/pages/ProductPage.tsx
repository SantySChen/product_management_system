import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, ButtonGroup } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { useContext } from 'react';
import { Store } from '../Store';
import { useDocumentTitle } from '../hooks/titleHooks';
import type { ApiError } from '../types/ApiError';
import { useAddToCartMutation, useDecreaseCartItemMutation, useGetCartItemQuantity } from '../hooks/cartHooks';
import { useQueryClient } from '@tanstack/react-query';
import type { Cart } from '../types/Cart';
import { useGetProductById } from '../hooks/productHooks';

const ProductPage: React.FC = () => {
  const { id: productId } = useParams();
  useDocumentTitle('Product Detail');
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useGetProductById(productId!);
  const {
    data: quantityData = 0,
    isLoading: isQuantityLoading,
    refetch: refetchQuantity,
  } = useGetCartItemQuantity(productId!);

  const actualQuantity = quantityData;
  const isCartLoading = isQuantityLoading;

  const handleMutationSuccess = (updateCart: Cart) => {
    dispatch({ type: 'CART_UPDATE', payload: updateCart });
    queryClient.setQueryData(['cart'], updateCart);
    refetchQuantity();
  };

  const addToCart = useAddToCartMutation({ onSuccess: handleMutationSuccess });
  const decreaseCartItem = useDecreaseCartItemMutation({ onSuccess: handleMutationSuccess });

  const handleAdd = () => {
    addToCart.mutate({ productId: productId!, quantity: 1 });
  };

  const handleIncrease = () => {
    if (actualQuantity < product!.countInStock) {
      addToCart.mutate({ productId: productId!, quantity: 1 });
    }
  };

  const handleDecrease = () => {
    if (actualQuantity > 0) {
      decreaseCartItem.mutate(productId!);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${productId}`);
  };

  return (
    <Container className="my-4">
      {isLoading || isCartLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
      ) : product ? (
        <>
          <h3 className="mb-4">Product Detail</h3>
          <Row>
            {/* Left: Product Image */}
            <Col md={6}>
              <Image
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                rounded
              />
            </Col>

            <Col md={6}>
              <p className="text-muted mb-1">{product.category}</p>    
              <div className="d-flex flex-column gap-2">
                <h4 className="mb-1">{product.name}</h4>
                <h5 className="mt-3">
                  <span className='text-success me-3'>
                    ${product.price.toFixed(2)}
                  </span>
                  {product.countInStock === 0 && (
                    <span className="text-danger fw-semibold">Out of Stock</span> 
                  )}
                 </h5>
                <div
                  style={{
                    maxWidth: '100%',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    fontSize: '0.95rem',
                  }}
                >
                  {product.description}
                </div>
              </div>

            {userInfo && (
              <div className="d-flex justify-content-between mt-3">
                {product.countInStock > 0 ? (actualQuantity === 0 ? (
                  <Button variant="success" onClick={handleAdd}>
                    Add to Cart
                  </Button>
                ) : (
                  <ButtonGroup>
                    <Button variant="outline-secondary" onClick={handleDecrease}>-</Button>
                    <Button variant="success" disabled>{actualQuantity}</Button>
                    <Button variant="outline-secondary" onClick={handleIncrease}>+</Button>
                  </ButtonGroup>
                )
              ) : (
                <Button variant='secondary' disabled>
                  Out of Stock
                </Button>
              )}
                {userInfo.isManager && (
                  <Button variant="outline-primary" onClick={handleEdit}>
                    Edit
                  </Button>
                )}
              </div>
            ) }
          </Col>

          </Row>
        </>
      ) : (
        <MessageBox variant="warning">Product not found.</MessageBox>
      )}
    </Container>
  );
};

export default ProductPage;
