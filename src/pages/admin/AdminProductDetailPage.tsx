import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Typography,
    Spin,
    Alert,
    Button,
    Tag,
    Divider,
    Descriptions,
    Space,
    Popconfirm,
    message,
} from 'antd'
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { productService } from '../../services/productService'
import type { Product } from '../../types/product'

const { Title } = Typography

const CATEGORIES: Record<number, string> = {
    1: 'Alimentação & Petiscos',
    2: 'Saúde & Farmácia',
    3: 'Higiene & Estética',
    4: 'Brinquedos',
    5: 'Acessórios & Conforto',
    6: 'Habitats & Casas',
}

export default function AdminProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

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

    async function handleDelete() {
        if (!id) return
        try {
            await productService.remove(id)
            message.success('Produto excluído.')
            navigate('/admin/products')
        } catch {
            message.error('Erro ao excluir o produto.')
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 64 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div style={{ padding: 24 }}>
                <Alert type="error" message={error ?? 'Produto não encontrado.'} />
                <Button
                    icon={<ArrowLeftOutlined />}
                    style={{ marginTop: 16 }}
                    onClick={() => navigate('/admin/products')}
                >
                    Voltar
                </Button>
            </div>
        )
    }

    const price = Number(product.currentPrice).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    return (
        <div style={{ padding: 24 }}>
            <Button
                icon={<ArrowLeftOutlined />}
                type="link"
                style={{ padding: 0, marginBottom: 16 }}
                onClick={() => navigate('/admin/products')}
            >
                Voltar
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Tag color="blue" style={{ marginBottom: 8 }}>
                        {CATEGORIES[product.categoryId] ?? `Categoria ${product.categoryId}`}
                    </Tag>
                    <Title level={3} style={{ marginTop: 0 }}>{product.name}</Title>
                </div>

                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="Excluir produto"
                        description="Tem certeza que deseja excluir este produto?"
                        onConfirm={handleDelete}
                        okText="Excluir"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />}>Excluir</Button>
                    </Popconfirm>
                </Space>
            </div>

            <Divider />

            <Descriptions bordered column={1} style={{ maxWidth: 600 }}>
                <Descriptions.Item label="Preço">{price}</Descriptions.Item>
                <Descriptions.Item label="Estoque">
                    <Tag color={product.stockQuantity > 0 ? 'green' : 'red'}>
                        {product.stockQuantity} unidades
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Descrição">{product.description}</Descriptions.Item>
                <Descriptions.Item label="Cadastrado em">
                    {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                </Descriptions.Item>
                <Descriptions.Item label="Atualizado em">
                    {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
}
