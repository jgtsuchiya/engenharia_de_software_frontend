import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Spin, Alert, Button, Popconfirm, message } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import ProductForm from '../../components/product/ProductForm'
import { productService } from '../../services/productService'
import type { CreateProductPayload, Product } from '../../types/product'

const { Title } = Typography

export default function AdminProductFormPage() {
    const { id } = useParams<{ id?: string }>()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(isEditing)
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
        setSubmitting(true)
        try {
            if (isEditing && id) {
                await productService.update(id, values)
                message.success('Produto atualizado com sucesso!')
            } else {
                await productService.create(values)
                message.success('Produto cadastrado com sucesso!')
            }
            navigate('/admin/products')
        } catch {
            message.error(isEditing ? 'Erro ao atualizar o produto.' : 'Erro ao cadastrar o produto.')
        } finally {
            setSubmitting(false)
        }
    }

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

    if (isEditing && (error || !product)) {
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

    const initialValues = product
        ? {
              name: product.name,
              categoryId: product.categoryId,
              description: product.description,
              currentPrice: Number(product.currentPrice),
              stockQuantity: product.stockQuantity,
          }
        : undefined

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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    {isEditing ? 'Editar Produto' : 'Novo Produto'}
                </Title>

                {isEditing && (
                    <Popconfirm
                        title="Excluir produto"
                        description="Tem certeza que deseja excluir este produto?"
                        onConfirm={handleDelete}
                        okText="Excluir"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Excluir produto
                        </Button>
                    </Popconfirm>
                )}
            </div>

            <ProductForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel={isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
            />
        </div>
    )
}
