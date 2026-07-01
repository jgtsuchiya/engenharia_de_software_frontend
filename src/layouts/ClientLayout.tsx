import { ChairOutlined, HomeOutlined, Inventory2Outlined, MedicationLiquidOutlined, RestaurantOutlined, ShowerOutlined, SportsBaseballOutlined } from '@mui/icons-material'
import { Layout, Menu, type MenuProps } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import AppFooter from '../components/common/Footer'
import AppHeader from '../components/common/Header'


const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem
}


const items: MenuItem[] = [
    getItem('Todos os produtos', '0', <Inventory2Outlined />),
    getItem('Alimentação & Petiscos', '1', <RestaurantOutlined />),
    getItem('Saúde & Farmácia', '2', <MedicationLiquidOutlined />),
    getItem('Higiene & Estética', '3', <ShowerOutlined />),
    getItem('Brinquedos', '4', <SportsBaseballOutlined />),
    getItem('Acessórios & Conforto', '5', <ChairOutlined />),
    getItem('Habitats & Casas', '6', <HomeOutlined />),
]

export default function ClientLayout() {
    const navigate = useNavigate()

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider defaultCollapsed collapsible width={240} style={{
                overflow: 'auto',
                height: '100vh',
                position: 'sticky',
                insetInlineStart: 0,
                top: 0,
                scrollbarWidth: 'thin',
                scrollbarGutter: 'stable',
            }}>
                <Menu onClick={({ key }) => {
                    navigate("/products", { state: { categoryId: key !== '0' ? key : undefined } })
                }} theme="dark" mode="inline" items={items} style={{ paddingTop: 64 }} />
            </Sider>
            <Layout>
                <AppHeader />
                <Content>
                    <Outlet />
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    )
}
