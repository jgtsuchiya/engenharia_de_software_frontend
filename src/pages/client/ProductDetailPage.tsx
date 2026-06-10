import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Row,
    Col,
    Typography,
    Button,
    Spin,
    Alert,
    Tag,
    Divider,
    Space,
} from 'antd'
import { ShoppingCartOutlined, HeartFilled, HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { productService } from '../../services/productService'
import { useAuthContext } from '../../contexts/AuthContext'
import { useFavorites } from '../../hooks/useFavorites'
import type { Product } from '../../types/product'
import placeholderImage from '../../assets/hero.png'

const { Title, Text, Paragraph } = Typography

const CATEGORIES: Record<number, string> = {
    1: 'Alimentação & Petiscos',
    2: 'Saúde & Farmácia',
    3: 'Higiene & Estética',
    4: 'Brinquedos',
    5: 'Acessórios & Conforto',
    6: 'Habitats & Casas',
}

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { user } = useAuthContext()
    const { isFavorited, toggleFavorite } = useFavorites()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        productService
            .getById(id)
            .then(setProduct)
            .catch(() => setError('Produto não encontrado.'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 64 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div style={{ padding: '24px 48px' }}>
                <Alert type="error" message={error ?? 'Produto não encontrado.'} />
                <Button
                    icon={<ArrowLeftOutlined />}
                    style={{ marginTop: 16 }}
                    onClick={() => navigate('/')}
                >
                    Voltar à listagem
                </Button>
            </div>
        )
    }

    const price = Number(product.currentPrice).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    const inStock = product.stockQuantity > 0
    const isClient = user?.role === 'client'
    const favorited = product ? isFavorited(product.id) : false

    return (
        <div style={{ padding: '24px 48px' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                type="link"
                style={{ padding: 0, marginBottom: 16 }}
                onClick={() => navigate('/')}
            >
                Voltar à listagem
            </Button>

            <Row gutter={[48, 24]}>
                <Col xs={24} md={10}>
                    <img
                        src={placeholderImage}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 400 }}
                    />
                </Col>

                <Col xs={24} md={14}>
                    <Tag color="blue" style={{ marginBottom: 8 }}>
                        {CATEGORIES[product.categoryId] ?? `Categoria ${product.categoryId}`}
                    </Tag>

                    <Title level={2} style={{ marginTop: 0 }}>
                        {product.name}
                    </Title>

                    <Title level={3} style={{ color: '#1677ff', margin: '8px 0 16px' }}>
                        {price}
                    </Title>

                    <Text type={inStock ? 'success' : 'danger'}>
                        {inStock ? `Em estoque (${product.stockQuantity} disponíveis)` : 'Sem estoque'}
                    </Text>

                    <Divider />

                    <Paragraph style={{ fontSize: 15, color: '#444' }}>
                        {product.description}
                    </Paragraph>

                    <Divider />

                    <Space size="middle">
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            disabled={!inStock}
                        >
                            Adicionar ao carrinho
                        </Button>

                        {isClient && (
                            <Button
                                size="large"
                                icon={
                                    favorited ? (
                                        <HeartFilled style={{ color: '#ff4d4f' }} />
                                    ) : (
                                        <HeartOutlined />
                                    )
                                }
                                onClick={() => toggleFavorite(product.id)}
                            >
                                {favorited ? 'Favoritado' : 'Favoritar'}
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>
        </div>
    )
}
