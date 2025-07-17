import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import type { Product } from '../types/Product';
import { useNavigate } from 'react-router-dom';

interface Props {
  initialProduct?: Product;
  onSubmit: (product: Product) => void;
  onRemove?: () => void;
  isEditMode?: boolean;
}

const ProductForm: React.FC<Props> = ({ initialProduct, onSubmit, onRemove, isEditMode = false }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('http://');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setImage(initialProduct.image);
      setCategory(initialProduct.category);
      setPrice(initialProduct.price.toString());
      setDescription(initialProduct.description);
      setCountInStock(initialProduct.countInStock.toString());
      setPreviewUrl(initialProduct.image);
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    const numericCount = Number(countInStock);
    if (
      isNaN(numericPrice) || numericPrice < 0 ||
      isNaN(numericCount) || numericCount < 0 ||
      !name || !image || !category || !description
    ) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const newProduct: Product = {
      ...initialProduct,
      name,
      image,
      category,
      price: numericPrice,
      description,
      countInStock: numericCount,
    };
    await onSubmit(newProduct);
    navigate('/')
  };

  const handlePreview = () => {
    if (image && (image.startsWith('http://'))) {
      setPreviewUrl(image);
    } else {
      setPreviewUrl('');
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <h3 className="mb-3">{isEditMode ? 'Edit Product' : 'Create Product'}</h3>
      <Card className="p-4 shadow" style={{ maxWidth: '700px', width: '100%' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 text-start">
            <Form.Label>Product Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3 text-start">
            <Form.Label>Product Description</Form.Label>
            <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group className="text-start">
                <Form.Label>Category</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select category</option>
                  <option value="category1">category1</option>
                  <option value="category2">category2</option>
                  <option value="category3">category3</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="text-start">
                <Form.Label>Price</Form.Label>
                <Form.Control value={price} onChange={(e) => setPrice(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="text-start">
                <Form.Label>In Stock Quantity</Form.Label>
                <Form.Control value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="text-start">
                <Form.Label>Add Image Link</Form.Label>
                <InputGroup>
                  <Form.Control value={image} onChange={(e) => setImage(e.target.value)} required />
                  <Button onClick={handlePreview}>Preview</Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 text-center">
            <div className="d-flex justify-content-center">
              <div className="border rounded text-center p-3" style={{ width: '66.66%', minHeight: '200px' }}>
                {previewUrl ? (
                  <img src={previewUrl} className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="text-muted pt-5">Image Preview</div>
                )}
              </div>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button type="submit" className="btn-primary">
              {isEditMode ? 'Update' : 'Add'} Product
            </Button>
            {isEditMode && onRemove && (
              <Button variant="danger" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default ProductForm;