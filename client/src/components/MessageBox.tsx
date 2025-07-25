import Alert from 'react-bootstrap/Alert'
import React from 'react'

export default function MessageBox({
    variant = 'info',
    children,
}: {
    variant?: string
    children: React.ReactNode
}) {
  return <Alert variant={variant || 'info'}>{children}</Alert>
}
