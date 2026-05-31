import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'

test('AuthProvider renders children without crashing', () => {
    render(
        <AuthProvider>
            <div>test content</div>
        </AuthProvider>,
    )
    expect(screen.getByText('test content')).toBeInTheDocument()
})
