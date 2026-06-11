import { Card } from 'antd'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import placeholderImage from '../../assets/hero.png'

const { Meta } = Card

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link to={`/products/${product.id}`} style={{ display: 'block' }}>
            <Card
                hoverable
                cover={
                    <img
                        alt={product.name}
                        src={placeholderImage}
                        style={{ height: 200, objectFit: 'cover' }}
                    />
                }
            >
                <Meta
                    title={product.name}
                    description={
                        <span style={{ fontWeight: 600, color: '#1677ff', fontSize: 16 }}>
                            {Number(product.currentPrice).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </span>
                    }
                />
            </Card>
        </Link>
    )
}
