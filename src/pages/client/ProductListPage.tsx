import { SearchOutlined } from '@ant-design/icons'
import { Alert, Card, Col, Empty, Flex, Input, Row, Select, Slider, Spin, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import { productService } from '../../services/productService'
import type { Product, ProductFilters, SortBy, SortOrder } from '../../types/product'

const { Title } = Typography
const { Option } = Select

const CATEGORIES: Record<number, string> = {
    1: 'Alimentação & Petiscos',
    2: 'Saúde & Farmácia',
    3: 'Higiene & Estética',
    4: 'Brinquedos',
    5: 'Acessórios & Conforto',
    6: 'Habitats & Casas',
}

type SortOption = `${SortBy}_${SortOrder}`

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'name_asc', label: 'Nome (A → Z)' },
    { value: 'name_desc', label: 'Nome (Z → A)' },
    { value: 'price_asc', label: 'Preço (menor → maior)' },
    { value: 'price_desc', label: 'Preço (maior → menor)' },
]

const MAX_PRICE = 500

export default function ProductListPage() {
    const location = useLocation()
    const [petMatchImgSrc] = useState(() => getPetMatchImageSrc())
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [filters, setFilters] = useState<ProductFilters>({})
    const [nameInput, setNameInput] = useState('')
    const [category, setCategory] = useState<number>()
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE])

    const fetchProducts = useCallback(async (activeFilters: ProductFilters) => {
        setLoading(true)
        setError(null)
        try {
            const data = await productService.getAll(activeFilters)
            setProducts(data)
        } catch {
            setError('Erro ao carregar os produtos. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts({})
    }, [fetchProducts])

    useEffect(() => {
        handleCategoryChange(location.state?.categoryId)
    }, [location.state?.categoryId])

    function applyFilters(partial: Partial<ProductFilters>) {
        const next = { ...filters, ...partial }
        setFilters(next)
        fetchProducts(next)
    }

    function handleNameSearch(value: string) {
        applyFilters({ name: value || undefined })
    }

    function handleCategoryChange(value: number | undefined) {
        applyFilters({ category: value })
        setCategory(value)
    }

    function handleSortChange(value: SortOption | undefined) {
        if (!value) {
            applyFilters({ sortBy: undefined, order: undefined })
            return
        }
        const [sortBy, order] = value.split('_') as [SortBy, SortOrder]
        applyFilters({ sortBy, order })
    }

    function handlePriceChange(value: [number, number]) {
        setPriceRange(value)
        applyFilters({
            minPrice: value[0] > 0 ? value[0] : undefined,
            maxPrice: value[1] < MAX_PRICE ? value[1] : undefined,
        })
    }

    const productList = useMemo(() => {
        return <>{products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
            </Col>
        ))}</>
    }, [products])

    return (
        <Flex style={{ padding: '24px 96px', backgroundImage: petMatchImgSrc, minHeight: "calc(100svh - 64px - 74px)" }}>
            <Card style={{ flex: 1 }}>
                <Title level={2}>Produtos</Title>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
                    <Col xs={24} sm={10} md={7}>
                        <Input.Search
                            placeholder="Buscar por nome"
                            prefix={<SearchOutlined />}
                            allowClear
                            onSearch={handleNameSearch}
                            onChange={(e) => {
                                setNameInput(e.target.value)
                                if (!e.target.value) handleNameSearch('')
                            }}
                            value={nameInput}
                        />
                    </Col>
                    <Col xs={24} sm={7} md={5}>
                        <Select
                            placeholder="Categoria"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={handleCategoryChange}
                            value={category}
                            options={Object.entries(CATEGORIES).map(([id, label]) => ({
                                label,
                                value: id,
                            }))}
                        />
                    </Col>
                    <Col xs={24} sm={7} md={5}>
                        <Select
                            placeholder="Ordenar por"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={handleSortChange}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <Option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} md={7}>
                        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                            Preço: R$ {priceRange[0]} – R$ {priceRange[1]}
                            {priceRange[1] === MAX_PRICE ? '+' : ''}
                        </Typography.Text>
                        <Slider
                            range
                            min={0}
                            max={MAX_PRICE}
                            value={priceRange}
                            onChange={(v) => setPriceRange(v as [number, number])}
                            onChangeComplete={(v) => handlePriceChange(v as [number, number])}
                            tooltip={{ formatter: (v) => `R$ ${v}` }}
                        />
                    </Col>
                </Row>
                {error && (
                    <Alert type="error" message={error} style={{ marginBottom: 16 }} />
                )}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 64 }}>
                        <Spin size="large" />
                    </div>
                ) : products.length === 0 ? (
                    <Empty description="Nenhum produto encontrado." />
                ) : (
                    <Row gutter={[16, 16]}>
                        {productList}
                    </Row>
                )}
            </Card>
        </Flex>
    )
}

function getPetMatchImageSrc() {
    const images = [
        "images/pet_match_blue.png",
        "images/pet_match_green.jpg",
        "images/pet_match_violet.jpg",
        "images/pet_match_yellow.png",
    ]

    const rand = Math.round(Math.random() * 100) % 4

    return `url("${images[rand]}")`
}
