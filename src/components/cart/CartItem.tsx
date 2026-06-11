import { Button, Typography, Space, InputNumber } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { CartItem as CartItemType } from '../../types/cart'
import { useCart } from '../../hooks/useCart'

const { Text } = Typography

interface Props {
    item: CartItemType
}

export default function CartItem({ item }: Props) {
    const { removeItem, updateQuantity } = useCart()

    const unitPrice = Number(item.product.currentPrice)
    const subtotal = unitPrice * item.quantity

    const fmt = (value: number) =>
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
                gap: 16,
            }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ display: 'block', fontSize: 15 }}>
                    {item.product.name}
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {fmt(unitPrice)} / un.
                </Text>
            </div>

            <Space size="middle" align="center">
                <InputNumber
                    min={1}
                    max={item.product.stockQuantity}
                    value={item.quantity}
                    onChange={(val) => val && updateQuantity(item.product.id, val)}
                    style={{ width: 72 }}
                    size="small"
                />

                <Text style={{ minWidth: 80, textAlign: 'right', fontWeight: 600 }}>
                    {fmt(subtotal)}
                </Text>

                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(item.product.id)}
                    size="small"
                />
            </Space>
        </div>
    )
}
