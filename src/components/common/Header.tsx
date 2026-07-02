import { useAuthContext } from '@/contexts/AuthContext'
import { useCart } from '@/hooks/useCart'
import { HeartOutlined, LoginOutlined, LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Badge, Button, Flex, Layout, Typography } from "antd"
import { useNavigate } from 'react-router-dom'

const { Header } = Layout

export default function AppHeader() {
    const { isAuthenticated, logout } = useAuthContext()
    const { cart: { items } } = useCart()
    const navigate = useNavigate()

    return (
        <Header>
            <Flex flex={1} align="center" justify='space-between' style={{ height: "100%" }}>
                <Typography.Title level={1} style={{ margin: 0, color: "whitesmoke", cursor: "pointer", fontFamily: "Patrick Hand SC" }} onClick={() => navigate("/")}>
                    PetShop
                </Typography.Title>
                {isAuthenticated && <Flex flex={1} justify='end' style={{ marginRight: 12 }}>
                    <Badge size='small' count={items.length} offset={[-8, 10]}>
                        <Button onClick={() => {
                            return navigate("/cart")
                        }} type='text' style={{ color: "white" }} size="large" icon={<ShoppingCartOutlined />} />
                    </Badge>
                    <Button onClick={() => {
                        return navigate("/favorites")
                    }} type='text' style={{ color: "white" }} size="large" icon={<HeartOutlined />} />
                    <Button onClick={() => {
                        return navigate("/profile")
                    }} type='text' style={{ color: "white" }} size="large" icon={<UserOutlined />} />
                </Flex>}
                {isAuthenticated ? <Button onClick={() => {
                    logout()
                }} icon={<LogoutOutlined />}>Sair</Button> : <Button onClick={() => {
                    return navigate("/auth/login")
                }} icon={<LoginOutlined />}>Entrar</Button>}
            </Flex>
        </Header>
    )
}
