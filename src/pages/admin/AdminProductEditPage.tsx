import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Spin, Alert, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import ProductForm from '../../components/product/ProductForm'
import { productService } from '../../services/productService'
import type { CreateProductPayload, Product } from '../../types/product'

const { Title } = Typography

export default function AdminProductEditPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        productService
            .getById(id)
            .then(setProduct)
            .catch(() => setError('Produto não encontrado.'))
            .finally(() => setLoading(false))
    }, [id])

    async function handleSubmit(values: CreateProductPayload) {
        if (!id) return
        setSubmitting(true)
        try {
            await productService.update(id, values)
            message.success('Produto atualizado com sucesso!')
            navigate('/admin/products')
        } catch {
            message.error('Erro ao atualizar o produto.')
        } finally {
            setSubmitting(false)
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

    const initialValues: Partial<CreateProductPayload> = {
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        currentPrice: Number(product.currentPrice),
        stockQuantity: product.stockQuantity,
    }

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

            <Title level={3}>Editar Produto</Title>

            <ProductForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Salvar Alterações"
            />
        </div>
    )
}
