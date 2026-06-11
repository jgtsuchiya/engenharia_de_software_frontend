import { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Steps, Radio } from 'antd'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import type { ResetPasswordPayload } from '../../types/auth'

const { Title } = Typography

type Role = 'customer' | 'merchant'

interface RequestFormValues {
    email: string
    role: Role
}

interface ResetFormValues {
    code: string
    new_password: string
    confirm_password: string
}

export default function PasswordRecoveryPage() {
    const [step, setStep] = useState(0)
    const [info, setInfo] = useState<{ email: string; role: Role } | null>(null)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleRequest(values: RequestFormValues) {
        setError(null)
        setLoading(true)
        try {
            await authService.recoverPassword({ email: values.email, role: values.role })
            setInfo({ email: values.email, role: values.role })
            setStep(1)
        } catch {
            setError('Não foi possível enviar o código. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    async function handleReset(values: ResetFormValues) {
        if (!info) return
        setError(null)
        setLoading(true)
        try {
            const payload: ResetPasswordPayload = {
                email: info.email,
                role: info.role,
                code: values.code,
                new_password: values.new_password,
            }
            await authService.resetPassword(payload)
            setSuccess(true)
        } catch {
            setError('Código inválido ou expirado. Solicite um novo código.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card style={{ width: 440 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Recuperar senha</Title>

                <Steps
                    current={step}
                    items={[{ title: 'Solicitar código' }, { title: 'Redefinir senha' }]}
                    style={{ marginBottom: 24 }}
                />

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                {success && (
                    <Alert
                        message="Senha redefinida com sucesso!"
                        description={<Link to="/auth/login">Clique aqui para entrar</Link>}
                        type="success"
                        showIcon
                    />
                )}

                {!success && step === 0 && (
                    <Form layout="vertical" onFinish={handleRequest} initialValues={{ role: 'customer' }}>
                        <Form.Item name="role" label="Tipo de conta">
                            <Radio.Group>
                                <Radio value="customer">Cliente</Radio>
                                <Radio value="merchant">Lojista</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-mail cadastrado"
                            rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido.' }]}
                        >
                            <Input placeholder="seu@email.com" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Enviar código
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {!success && step === 1 && (
                    <Form layout="vertical" onFinish={handleReset}>
                        <Alert
                            message={`Código enviado para ${info?.email}`}
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />

                        <Form.Item
                            name="code"
                            label="Código de verificação"
                            rules={[{ required: true, len: 6, message: 'Informe o código de 6 dígitos.' }]}
                        >
                            <Input placeholder="000000" maxLength={6} />
                        </Form.Item>

                        <Form.Item
                            name="new_password"
                            label="Nova senha"
                            rules={[{ required: true, min: 6, message: 'Mínimo de 6 caracteres.' }]}
                        >
                            <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            label="Confirmar nova senha"
                            dependencies={['new_password']}
                            rules={[
                                { required: true, message: 'Confirme a nova senha.' },
                                ({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
                                    validator(_rule: unknown, value: string) {
                                        if (!value || getFieldValue('new_password') === value) return Promise.resolve()
                                        return Promise.reject(new Error('As senhas não coincidem.'))
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Redefinir senha
                            </Button>
                        </Form.Item>

                        <Button type="link" onClick={() => { setStep(0); setError(null) }} block>
                            Solicitar novo código
                        </Button>
                    </Form>
                )}

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Link to="/auth/login">Voltar ao login</Link>
                </div>
            </Card>
        </div>
    )
}
