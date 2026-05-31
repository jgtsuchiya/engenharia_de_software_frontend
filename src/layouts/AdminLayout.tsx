import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Sider, Content } = Layout

export default function AdminLayout() {
    return (
        <Layout>
            <Sider>
                <nav>Admin Navigation</nav>
            </Sider>
            <Layout>
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}
