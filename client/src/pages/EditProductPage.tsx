import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductById, useUpdateProductMutation, useDeleteProductMutation } from '../hooks/productHooks';
import ProductForm from '../components/ProductForm';
import { useDocumentTitle } from '../hooks/titleHooks';

const EditProductPage: React.FC = () => {
  useDocumentTitle('Edit Product');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product } = useGetProductById(id!);
  const { mutate: updateProduct } = useUpdateProductMutation();
  const { mutate: deleteProduct } = useDeleteProductMutation();

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id!, {
        onSuccess: () => navigate('/home')
      });
    }
  };

  return product ? (
    <ProductForm
      initialProduct={product}
      onSubmit={(updatedProduct) => updateProduct({ id: id!, product: updatedProduct })}
      onRemove={handleRemove}
      isEditMode={true}
    />
  ) : (
    <p>Loading...</p>
  );
};

export default EditProductPage;
