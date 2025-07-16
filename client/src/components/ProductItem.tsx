import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import type { Product } from '../types/Product'

function ProductItem({ product }: { product: Product }) {
    return (
        <Card>
            <Link to={`/product/${product._id}`}>
                <img src={product.image} className='card-img-top' alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Card.Text>${product.price}</Card.Text>
                {product.countInStock === 0 ? (
                    <Button variant='light' disabled>
                        Out of Stock
                    </Button>
                ) : (
                    <Button>Add to Cart</Button>
                )
                }
            </Card.Body>
        </Card>
    )
}

export default ProductItem