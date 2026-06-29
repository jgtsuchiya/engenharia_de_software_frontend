import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/common/Header'
import AppFooter from '../components/common/Footer'

const { Content } = Layout

export default function ClientLayout() {
    return (
        <Layout>
            <AppHeader />
            <Content style={{}}>
                <Outlet />
            </Content>
            <AppFooter />
        </Layout>
    )
}
