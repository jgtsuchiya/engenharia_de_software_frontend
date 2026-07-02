import { Layout } from 'antd'

const { Footer } = Layout

export default function AppFooter() {
    return <Footer>Petly © {new Date().getFullYear()}</Footer>
}
