import { Row, Col, Typography, Spin, Empty, Button, Card } from 'antd'
import { HeartFilled, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'
import placeholderImage from '../../assets/hero.png'

const { Title, Text } = Typography
const { Meta } = Card

export default function FavoritesPage() {
    const { favorites, loading, toggleFavorite } = useFavorites()

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 64 }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div style={{ padding: '24px 48px' }}>
            <Title level={2}>
                <HeartFilled style={{ color: '#ff4d4f', marginRight: 10 }} />
                Meus Favoritos
            </Title>

            {favorites.length === 0 ? (
                <Empty
                    description="Você ainda não possui produtos favoritos."
                    style={{ marginTop: 48 }}
                />
            ) : (
                <Row gutter={[16, 16]}>
                    {favorites.map((product) => (
                        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                cover={
                                    <Link to={`/products/${product.id}`}>
                                        <img
                                            alt={product.name}
                                            src={placeholderImage}
                                            style={{ height: 200, objectFit: 'cover', width: '100%' }}
                                        />
                                    </Link>
                                }
                                actions={[
                                    <Button
                                        key="remove"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => toggleFavorite(product.id)}
                                    >
                                        Remover
                                    </Button>,
                                ]}
                            >
                                <Link to={`/products/${product.id}`} style={{ color: 'inherit' }}>
                                    <Meta
                                        title={product.name}
                                        description={
                                            <Text style={{ fontWeight: 600, color: '#1677ff', fontSize: 16 }}>
                                                {Number(product.currentPrice).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Text>
                                        }
                                    />
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    )
}
