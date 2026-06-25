import { useState } from 'react'
import { Typography, Button, Empty, Divider, Space, Alert, Spin } from 'antd'
import { WhatsAppOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuthContext } from '../../contexts/AuthContext'
import CartItem from '../../components/cart/CartItem'
import { orderService } from '../../services/orderService'
import type { CheckoutResponse } from '../../types/order'

const { Title, Text } = Typography

function buildWhatsAppUrl(merchant: CheckoutResponse['merchant'], order: CheckoutResponse['order']): string {
    const phone = merchant.document.replace(/\D/g, '')

    const itemLines = order.items
        .map((i) => `• ${i.product.name} x${i.quantity} — ${Number(i.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
        .join('\n')

    const total = Number(order.totalAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const message = encodeURIComponent(
        `Olá, *${merchant.tradeName}*! Gostaria de finalizar meu pedido:\n\n${itemLines}\n\n*Total: ${total}*\n\nPedido #${order.id}`,
    )

    return `https://wa.me/${phone}?text=${message}`
}

export default function CartPage() {
    const { cart, clearCart } = useCart()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEmpty = cart.items.length === 0

    const merchantId = isEmpty ? null : cart.items[0].product.merchantId

    const hasMixedMerchants = !isEmpty &&
        cart.items.some((i) => i.product.merchantId !== merchantId)

    async function handleCheckout() {
        if (!user || !merchantId) return

        setLoading(true)
        setError(null)

        try {
            const response = await orderService.checkout(user.id, {
                merchantId,
                items: cart.items.map((i) => ({
                    productId: i.product.id,
                    quantity: i.quantity,
                })),
            })

            clearCart()

            const url = buildWhatsAppUrl(response.merchant, response.order)
            window.open(url, '_blank', 'noopener,noreferrer')

            navigate('/')
        } catch {
            setError('Não foi possível registrar o pedido. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const fmtTotal = cart.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
            <Title level={2}>
                <ShoppingCartOutlined style={{ marginRight: 8 }} />
                Meu Carrinho
            </Title>

            {isEmpty ? (
                <Empty description="Seu carrinho está vazio." style={{ marginTop: 48 }}>
                    <Button type="primary" onClick={() => navigate('/')}>
                        Ver produtos
                    </Button>
                </Empty>
            ) : (
                <>
                    {hasMixedMerchants && (
                        <Alert
                            type="warning"
                            message="Seu carrinho contém produtos de lojistas diferentes. O checkout será feito apenas com produtos do mesmo lojista."
                            style={{ marginBottom: 16 }}
                            showIcon
                        />
                    )}

                    {error && (
                        <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />
                    )}

                    <div>
                        {cart.items.map((item) => (
                            <CartItem key={item.product.id} item={item} />
                        ))}
                    </div>

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Total</Text>
                        <Text strong style={{ fontSize: 22, color: '#1677ff' }}>
                            {fmtTotal}
                        </Text>
                    </div>

                    <Divider />

                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate('/')}>
                            Continuar comprando
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            icon={loading ? <Spin size="small" /> : <WhatsAppOutlined />}
                            style={{ backgroundColor: '#25d366', borderColor: '#25d366' }}
                            disabled={loading || hasMixedMerchants}
                            onClick={handleCheckout}
                        >
                            Finalizar pelo WhatsApp
                        </Button>
                    </Space>
                </>
            )}
        </div>
    )
}
