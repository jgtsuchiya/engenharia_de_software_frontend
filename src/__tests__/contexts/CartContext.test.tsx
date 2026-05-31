import { render, screen } from '@testing-library/react'
import { CartProvider } from '../../contexts/CartContext'

test('CartProvider renders children without crashing', () => {
    render(
        <CartProvider>
            <div>test content</div>
        </CartProvider>,
    )
    expect(screen.getByText('test content')).toBeInTheDocument()
})
