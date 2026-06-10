import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Popconfirm, Divider, Descriptions } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import type { UpdateCustomerPayload, UpdateMerchantPayload } from '../../services/userService'

const { Title } = Typography

export default function ProfilePage() {
    const { user, token, login, logout } = useAuth()
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if (!user) return
        if (user.role === 'client') {
            form.setFieldsValue({ name: user.name, email: user.email })
        } else {
            form.setFieldsValue({ trade_name: user.name, email: user.email })
        }
    }, [user, form])

    if (!user) return null

    const isClient = user.role === 'client'

    async function handleUpdate(values: Record<string, string>) {
        if (!user) return
        setError(null)
        setSuccess(null)
        setLoading(true)
        try {
            let updated
            if (isClient) {
                const payload: UpdateCustomerPayload = {}
                if (values.name) payload.name = values.name
                if (values.email) payload.email = values.email
                if (values.password) payload.password = values.password
                updated = await userService.updateCustomerProfile(user.id, payload)
            } else {
                const payload: UpdateMerchantPayload = {}
                if (values.trade_name) payload.trade_name = values.trade_name
                if (values.email) payload.email = values.email
                if (values.password) payload.password = values.password
                updated = await userService.updateMerchantProfile(user.id, payload)
            }
            login(token!, { ...user, ...updated })
            setSuccess('Perfil atualizado com sucesso.')
            setEditing(false)
        } catch {
            setError('Não foi possível atualizar o perfil. Verifique os dados e tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!user) return
        setDeleteLoading(true)
        try {
            if (isClient) {
                await userService.deleteCustomerAccount(user.id)
            } else {
                await userService.deleteMerchantAccount(user.id)
            }
            logout()
            navigate('/auth/login')
        } catch {
            setError('Não foi possível excluir a conta.')
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
            <Card>
                <Title level={3}>Meu Perfil</Title>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />}

                {!editing && (
                    <>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label={isClient ? 'Nome' : 'Nome da loja'}>
                                {user.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="E-mail">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Tipo de conta">
                                {isClient ? 'Cliente' : 'Lojista'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Button
                            type="primary"
                            onClick={() => { setEditing(true); setSuccess(null) }}
                            style={{ marginTop: 16 }}
                        >
                            Editar perfil
                        </Button>
                    </>
                )}

                {editing && (
                    <Form layout="vertical" form={form} onFinish={handleUpdate}>
                        {isClient ? (
                            <Form.Item
                                name="name"
                                label="Nome completo"
                                rules={[{ required: true, message: 'Informe o nome.' }]}
                            >
                                <Input />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name="trade_name"
                                label="Nome da loja"
                                rules={[{ required: true, message: 'Informe o nome da loja.' }]}
                            >
                                <Input />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Nova senha (deixe em branco para manter)"
                        >
                            <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            label="Confirmar nova senha"
                            dependencies={['password']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const pwd = getFieldValue('password')
                                        if (!pwd || !value || pwd === value) return Promise.resolve()
                                        return Promise.reject(new Error('As senhas não coincidem.'))
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                                Salvar
                            </Button>
                            <Button onClick={() => { setEditing(false); setError(null) }}>
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                <Divider />

                <Popconfirm
                    title="Excluir conta"
                    description="Tem certeza? Esta ação não pode ser desfeita."
                    onConfirm={handleDelete}
                    okText="Excluir"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger loading={deleteLoading}>
                        Excluir minha conta
                    </Button>
                </Popconfirm>
            </Card>
        </div>
    )
}
