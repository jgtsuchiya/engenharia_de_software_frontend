import { useState } from 'react'
import { Form, Input, Button, Card, Radio, Typography, Alert } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import type { LoginPayload } from '../../types/auth'

const { Title } = Typography

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(values: LoginPayload) {
        setError(null)
        setLoading(true)
        try {
            const { token, user } = await authService.login(values)
            login(token, user)
            navigate(user.role === 'admin' ? '/admin/products' : '/')
        } catch {
            setError('E-mail, senha ou tipo de conta inválidos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Entrar</Title>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form layout="vertical" onFinish={handleSubmit} initialValues={{ role: 'customer' }}>
                    <Form.Item name="role" label="Tipo de conta">
                        <Radio.Group>
                            <Radio value="customer">Cliente</Radio>
                            <Radio value="merchant">Lojista</Radio>
                        </Radio.Group>
                    </Form.Item>

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
                        rules={[{ required: true, message: 'Informe a senha.' }]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Entrar
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/auth/register">Criar conta</Link>
                    {' · '}
                    <Link to="/auth/recovery">Esqueci a senha</Link>
                </div>
            </Card>
        </div>
    )
}
