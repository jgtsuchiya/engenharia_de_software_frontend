import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import ProductForm from '../../components/product/ProductForm'
import { productService } from '../../services/productService'
import type { CreateProductPayload } from '../../types/product'

const { Title } = Typography

export default function AdminProductCreatePage() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(values: CreateProductPayload) {
        setSubmitting(true)
        try {
            await productService.create(values)
            message.success('Produto cadastrado com sucesso!')
            navigate('/admin/products')
        } catch {
            message.error('Erro ao cadastrar o produto.')
        } finally {
            setSubmitting(false)
        }
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

            <Title level={3}>Novo Produto</Title>

            <ProductForm
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Cadastrar Produto"
            />
        </div>
    )
}
