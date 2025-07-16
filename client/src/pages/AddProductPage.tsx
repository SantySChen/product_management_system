import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProductMutation } from '../hooks/productHooks';
import type { Product } from '../types/Product';
import { getError } from '../utils';
import type { ApiError } from '../types/ApiError';
import { toast } from 'react-toastify';
import { useDocumentTitle } from '../hooks/titleHooks';

const AddProductPage: React.FC = () => {
  useDocumentTitle('Add A New Product');

  const { register, handleSubmit, reset, watch, setValue } = useForm<Product>();
  const [imagePreview, setImagePreview] = useState<string>('');
  const { mutateAsync: createProduct } = useCreateProductMutation();

  const onSubmit = async (data: Product) => {
    try {
      await createProduct(data);
      toast.success('Product created successfully');
      reset();
      setImagePreview('');
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  const handleImagePreview = () => {
    let url = watch('image')?.trim();

  if (!url) return;

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
    setValue('image', url); // 👈 update the form value
  }

  setImagePreview(url);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Product name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register('description')}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Product description"
          />
        </div>

        {/* Category + Price */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block font-medium">Category</label>
            <select {...register('category')} className="w-full p-2 border rounded">
              <option value="">Select</option>
              <option value="Category1">Category1</option>
              <option value="Category2">Category2</option>
              <option value="Category3">Category3</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium">Price</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>
        </div>

        {/* Stock + Image */}
        <div className="flex space-x-4 items-end">
          <div className="flex-1">
            <label className="block font-medium">In Stock</label>
            <input
              type="number"
              {...register('countInStock', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Image URL</label>
            <div className="flex space-x-2">
              <input
                {...register('image')}
                className="flex-1 p-2 border rounded"
                placeholder="http://..."
              />
              <button
                type="button"
                className="bg-indigo-600 text-white px-3 py-1 rounded"
                onClick={handleImagePreview}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="border border-dashed border-gray-300 rounded p-4 text-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto h-40 object-contain"
            />
            <p className="text-sm text-gray-500 mt-2">Image preview</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded mt-4"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;

