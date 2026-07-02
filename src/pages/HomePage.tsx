import { Card, Carousel, Flex } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const [petMatchImgSrc] = useState(() => getPetMatchImageSrc())

    return <Flex style={{ padding: '24px 96px', backgroundImage: petMatchImgSrc, minHeight: "calc(100svh - 64px - 74px)" }}>
        <Card style={{ flex: 1 }} styles={{ body: { height: "100%" } }}>
            <Flex vertical gap="large" style={{ height: "100%" }}>
                <Flex flex={1} gap="medium">
                    <CategoryCard title='Alimentação & Petiscos' id='1' imgSrc='images/food.jpg' />
                    <CategoryCard title='Saúde & Farmácia' id='2' imgSrc='images/health.jpg' />
                    <CategoryCard title='Higiene & Estética' id='3' imgSrc='images/bath.jpg' />
                    <CategoryCard title='Habitats & Casas' id='6' imgSrc='images/house.jpg' />
                </Flex>
                <Flex flex={1} justify='center'>
                    <div style={{ maxWidth: "60vw" }}>
                        <Carousel autoplay arrows>
                            <CategoryCard title='Brinquedos' id='4' imgSrc='images/toys.jpg' />
                            <CategoryCard title='Acessórios & Conforto' id='5' imgSrc='images/comfort.jpg' />
                        </Carousel>
                    </div>
                    {/* <CategoryCard title='Brinquedos' id='4' /> */}
                    {/* <CategoryCard title='Acessórios & Conforto' id='5' /> */}
                </Flex>
            </Flex>
        </Card>
    </Flex>
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

const { Meta } = Card

interface CategoryCardProps {
    id: string
    title: string
    imgSrc: string
}

function CategoryCard({ id, title, imgSrc }: CategoryCardProps) {
    const navigate = useNavigate()

    return (
        <Card
            onClick={() => navigate("/products", { state: { categoryId: id } })}
            hoverable
            cover={
                <img
                    alt={title}
                    src={imgSrc}
                    style={{ objectFit: 'cover', height: "30vh" }}
                />
            }
            style={{ flex: 1 }}
            styles={{ body: { position: 'relative' } }}
        >
            <Meta title={title} />
        </Card>
    )
}
