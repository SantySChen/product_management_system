import { Col, Row } from "react-bootstrap"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import ProductItem from "../components/ProductItem"
import { useGetProductsQuery } from "../hooks/productHooks"
import type { ApiError } from "../types/ApiError"
import { getError } from "../utils"
import { useDocumentTitle } from "../hooks/titleHooks"

export default function HomePage() {
  useDocumentTitle('Home')
  const { data: products, isLoading, error } = useGetProductsQuery()
  return (
    isLoading ? (
      <LoadingBox />
    ) : error ? (
      <MessageBox variant='danger'>{getError(error as unknown as ApiError)}</MessageBox>
    ) : (
      <Row>
        {products!.map((product) => (
          <Col key={product._id} sm={6} md={4} lg={3}>
            <ProductItem product={product} />
          </Col>
        ))}
      </Row>
    )
  )
}
