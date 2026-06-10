import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Popconfirm, Typography, Space, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { productService } from '../../services/productService'
import { useAuth } from '../../hooks/useAuth'
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

export default function AdminProductListPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    async function loadProducts() {
        if (!user) return
        setLoading(true)
        try {
            const data = await productService.getAll({ merchantId: user.id })
            setProducts(data)
        } catch {
            message.error('Erro ao carregar os produtos.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [user])

    async function handleDelete(id: string) {
        try {
            await productService.remove(id)
            message.success('Produto excluído.')
            setProducts((prev) => prev.filter((p) => p.id !== id))
        } catch {
            message.error('Erro ao excluir o produto.')
        }
    }

    const columns: ColumnsType<Product> = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Categoria',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (id: number) => (
                <Tag color="blue">{CATEGORIES[id] ?? `Categoria ${id}`}</Tag>
            ),
        },
        {
            title: 'Preço',
            dataIndex: 'currentPrice',
            key: 'currentPrice',
            render: (price: number) =>
                Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        },
        {
            title: 'Estoque',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (qty: number) => (
                <Tag color={qty > 0 ? 'green' : 'red'}>{qty}</Tag>
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => navigate(`/admin/products/${record.id}/edit`)}
                    />
                    <Popconfirm
                        title="Excluir produto"
                        description="Tem certeza que deseja excluir este produto?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Excluir"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Meus Produtos</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/products/new')}
                >
                    Novo Produto
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={products}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    )
}
