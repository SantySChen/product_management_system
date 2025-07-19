import { useContext, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Col, Container, Row, Button, Dropdown, Pagination } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import { useDocumentTitle } from '../hooks/titleHooks';
import { getError } from '../utils';
import { useGetProductsQuery, useSearchProductsQuery } from '../hooks/productHooks';
import type { ApiError } from '../types/ApiError';
import { Store } from '../Store';
import { useGetCartQuery } from '../hooks/cartHooks';

type ContextType = { searchTerm: string };

export default function HomePage() {
  useDocumentTitle('Home');
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCartQuery()
  const cartItems = cart?.cartItems ?? [];
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { searchTerm } = useOutletContext<ContextType>()
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'latest' | 'price-asc' | 'price-desc'>('latest');
  const limit = 8;

  const endpointMap = {
    latest: 'sort/latest',
    'price-asc': 'sort/price-asc',
    'price-desc': 'sort/price-desc',
  };

  const quantityMap = cartItems.reduce((map, item) => {
    map[item.product] = item.quantity;
    return map;
  }, {} as Record<string, number>);

  const {
    data: sortedData,
    isLoading: sortedLoading,
    error: sortedError,
  } = useGetProductsQuery(endpointMap[sort], page, limit);

  const {
    data: searchedProducts,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchProductsQuery(searchTerm);

  const products = searchTerm ? searchedProducts : sortedData?.products;
  const isLoading = searchTerm ? searchLoading : sortedLoading;
  const error = searchTerm ? searchError : sortedError;

  return (
    <Container className="mt-4">
      {/* Header row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Products</h3>
        <div className="d-flex gap-2">
          {/* Sort Select Button */}
          <Dropdown
            onSelect={(value: string | null) => {
              if (value === 'latest' || value === 'price-asc' || value === 'price-desc') {
                setSort(value);
              }
            }}
          >
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {sort === 'latest'
                ? 'Last Added'
                : sort === 'price-asc'
                ? 'Price Low to High'
                : 'Price High to Low'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="latest">Last Added</Dropdown.Item>
              <Dropdown.Item eventKey="price-asc">Price Low to High</Dropdown.Item>
              <Dropdown.Item eventKey="price-desc">Price High to Low</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Add Product Button */}
          {userInfo?.isManager && (
            <Button onClick={() => navigate('/addproduct')} variant="primary">
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
      ) : (
        <>
          <Row>
            {products?.map((product) => (
              <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard 
                product={product}
                quantity={quantityMap[product._id!] || 0}
                cartLoading={cartLoading}
                 />
              </Col>
            ))}
          </Row>

          {/* Only show pagination when NOT searching */}
          {!searchTerm && sortedData && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                />
                <Pagination.Item active={page === 1} onClick={() => setPage(1)}>
                  1
                </Pagination.Item>
                {page > 3 && sortedData.pages > 5 && <Pagination.Ellipsis disabled />}

                {Array.from({ length: sortedData.pages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p !== 1 &&
                      p !== sortedData.pages &&
                      Math.abs(p - page) <= 1
                  )
                  .map((p) => (
                    <Pagination.Item
                      key={p}
                      active={p === page}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Pagination.Item>
                  ))}

                {page < sortedData.pages - 2 && sortedData.pages > 5 && <Pagination.Ellipsis disabled />}
                {sortedData.pages > 1 && (
                  <Pagination.Item
                    active={page === sortedData.pages}
                    onClick={() => setPage(sortedData.pages)}
                  >
                    {sortedData.pages}
                  </Pagination.Item>
                )}
                <Pagination.Next
                  onClick={() => setPage((p) => Math.min(p + 1, sortedData.pages))}
                  disabled={page === sortedData.pages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
