import { useAuth } from '@/hooks/useAuth'
import { LogoutOutlined } from '@ant-design/icons'
import { Flex, Layout, Menu } from 'antd'
import { Outlet } from 'react-router-dom'

const { Sider, Content } = Layout

export default function AdminLayout() {
    const { logout } = useAuth()

    return (
        <Layout>
            <Sider >
                <Flex vertical justify='end' style={{ height: "100%" }}>
                    <Menu theme='dark' >
                        <Menu.Item onClick={() => logout()} icon={<LogoutOutlined />}>Sair</Menu.Item>
                    </Menu>
                </Flex>
            </Sider>
            <Layout>
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}
