import React from 'react';
import { useCreateProductMutation } from '../hooks/productHooks';
import ProductForm from '../components/ProductForm';
import { useDocumentTitle } from '../hooks/titleHooks';

const AddProductPage: React.FC = () => {
  useDocumentTitle('Add A New Product');
  const { mutate: createProduct } = useCreateProductMutation();

  return (
    <ProductForm
      onSubmit={async (newProduct) => await createProduct(newProduct)}
      isEditMode={false}
    />
  );
};

export default AddProductPage;
