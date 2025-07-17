import React, { useContext, useState } from 'react';
import { Card, Button, ButtonGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { Store } from '../Store';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const { state } = useContext(Store)
  const { userInfo } = state
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => setQuantity(1);
  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
    else setQuantity(0); 
  };

  const handleEdit = () => {
    navigate(`/edit/${product._id}`);
  };

  return (
    <Card className="shadow-sm h-100">
      <Image
        src={product.image}
        alt={product.name}
        className="card-img-top"
        style={{ objectFit: 'cover', height: '200px' }}
        fluid
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fs-5">{product.name}</Card.Title>
          <Card.Text className="text-muted">${product.price.toFixed(2)}</Card.Text>
        </div>

        {userInfo && (
        <div className="d-flex justify-content-between mt-3">
          {quantity === 0 ? (
            <Button variant="success" onClick={handleAdd}>
              Add
            </Button>
          ) : (
            <ButtonGroup>
              <Button variant="outline-secondary" onClick={handleDecrease}>-</Button>
              <Button variant="success" disabled>{quantity}</Button>
              <Button variant="outline-secondary" onClick={handleIncrease}>+</Button>
            </ButtonGroup>
          )}
          {userInfo.isManager && (
          <Button variant="outline-primary" onClick={handleEdit}>
            Edit
          </Button>
          )}
        </div>
        ) }
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
