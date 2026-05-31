import { Layout } from 'antd'

const { Footer } = Layout

export default function AppFooter() {
    return <Footer>PetShop © {new Date().getFullYear()}</Footer>
}
