import { useState } from 'react'
import { Form, Input, Button, Card, Radio, Typography, Alert } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

const { Title } = Typography

interface FormValues {
    role: 'customer' | 'merchant'
    name?: string
    trade_name?: string
    document?: string
    email: string
    password: string
    confirm_password: string
}

export default function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<'customer' | 'merchant'>('customer')

    async function handleSubmit(values: FormValues) {
        setError(null)
        setLoading(true)
        try {
            const payload = values.role === 'customer'
                ? { role: 'customer' as const, name: values.name!, email: values.email, password: values.password }
                : { role: 'merchant' as const, trade_name: values.trade_name!, document: values.document!, email: values.email, password: values.password }

            const { token, user } = await authService.register(payload)
            login(token, user)
            navigate(user.role === 'admin' ? '/admin/products' : '/')
        } catch {
            setError('Não foi possível criar a conta. Verifique os dados e tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card style={{ width: 440 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Criar conta</Title>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form layout="vertical" onFinish={handleSubmit} initialValues={{ role: 'customer' }}>
                    <Form.Item name="role" label="Tipo de conta">
                        <Radio.Group onChange={(e) => setRole(e.target.value as 'customer' | 'merchant')}>
                            <Radio value="customer">Cliente</Radio>
                            <Radio value="merchant">Lojista</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {role === 'customer' && (
                        <Form.Item
                            name="name"
                            label="Nome completo"
                            rules={[{ required: true, message: 'Informe seu nome.' }]}
                        >
                            <Input placeholder="João da Silva" />
                        </Form.Item>
                    )}

                    {role === 'merchant' && (
                        <>
                            <Form.Item
                                name="trade_name"
                                label="Nome da loja"
                                rules={[{ required: true, message: 'Informe o nome da loja.' }]}
                            >
                                <Input placeholder="Minha Loja" />
                            </Form.Item>
                            <Form.Item
                                name="document"
                                label="CNPJ"
                                rules={[{ required: true, message: 'Informe o CNPJ.' }]}
                            >
                                <Input placeholder="00.000.000/0000-00" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido.' }]}
                    >
                        <Input placeholder="seu@email.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Senha"
                        rules={[{ required: true, min: 6, message: 'Mínimo de 6 caracteres.' }]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item
                        name="confirm_password"
                        label="Confirmar senha"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Confirme a senha.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve()
                                    return Promise.reject(new Error('As senhas não coincidem.'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Criar conta
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    Já tem conta? <Link to="/auth/login">Entrar</Link>
                </div>
            </Card>
        </div>
    )
}
