import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AnalyticsConsent from './AnalyticsConsent'

describe('AnalyticsConsent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders and accepts', () => {
    render(<AnalyticsConsent />)
    expect(screen.getByText(/Analytics/)).toBeInTheDocument()

    const accept = screen.getByText('Accept')
    fireEvent.click(accept)

    expect(localStorage.getItem('analytics:consent')).toBe('true')
  })

  it('declines', () => {
    render(<AnalyticsConsent />)
    const decline = screen.getByText('Decline')
    fireEvent.click(decline)
    expect(localStorage.getItem('analytics:consent')).toBe('false')
  })
})
