import { Card, Button } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { MouseEvent } from 'react'
import type { Product } from '../../types/product'
import { useAuthContext } from '../../contexts/AuthContext'
import { useFavorites } from '../../hooks/useFavorites'
import placeholderImage from '../../assets/hero.png'

const { Meta } = Card

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuthContext()
    const { isFavorited, toggleFavorite } = useFavorites()

    const isClient = user?.role === 'client'
    const favorited = isFavorited(product.id)

    function handleFavoriteClick(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(product.id)
    }

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
                extra={
                    isClient && (
                        <Button
                            type="text"
                            shape="circle"
                            icon={
                                favorited ? (
                                    <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} />
                                ) : (
                                    <HeartOutlined style={{ fontSize: 18 }} />
                                )
                            }
                            onClick={handleFavoriteClick}
                            style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        />
                    )
                }
                styles={{ body: { position: 'relative' } }}
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
