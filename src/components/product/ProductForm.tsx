import { Form, Input, InputNumber, Select, Button } from 'antd'
import type { CreateProductPayload } from '../../types/product'

const { TextArea } = Input
const { Option } = Select

const CATEGORIES: Record<number, string> = {
    1: 'Alimentação & Petiscos',
    2: 'Saúde & Farmácia',
    3: 'Higiene & Estética',
    4: 'Brinquedos',
    5: 'Acessórios & Conforto',
    6: 'Habitats & Casas',
}

interface ProductFormProps {
    initialValues?: Partial<CreateProductPayload>
    onSubmit: (values: CreateProductPayload) => Promise<void>
    submitting: boolean
    submitLabel: string
}

export default function ProductForm({ initialValues, onSubmit, submitting, submitLabel }: ProductFormProps) {
    const [form] = Form.useForm<CreateProductPayload>()

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onSubmit}
            style={{ maxWidth: 600 }}
        >
            <Form.Item label="Nome" name="name" rules={[{ required: true, message: 'Informe o nome do produto.' }]}>
                <Input placeholder="Ex: Ração Premium para Cães 15kg" />
            </Form.Item>

            <Form.Item label="Categoria" name="categoryId" rules={[{ required: true, message: 'Selecione uma categoria.' }]}>
                <Select placeholder="Selecione a categoria">
                    {Object.entries(CATEGORIES).map(([id, label]) => (
                        <Option key={id} value={Number(id)}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Descrição" name="description" rules={[{ required: true, message: 'Informe a descrição.' }]}>
                <TextArea rows={4} placeholder="Descreva o produto em detalhes..." />
            </Form.Item>

            <Form.Item label="Preço (R$)" name="currentPrice" rules={[{ required: true, message: 'Informe o preço.' }]}>
                <InputNumber
                    min={0.01}
                    precision={2}
                    style={{ width: '100%' }}
                    placeholder="0,00"
                />
            </Form.Item>

            <Form.Item label="Estoque" name="stockQuantity" rules={[{ required: true, message: 'Informe a quantidade em estoque.' }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting}>
                    {submitLabel}
                </Button>
            </Form.Item>
        </Form>
    )
}
