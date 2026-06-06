import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import type { ReactNode } from 'react'

interface HrefLinkProps extends Omit<LinkProps, 'to'> {
  href: string
  children?: ReactNode
  className?: string
}

export default function Link_({ href, children, ...rest }: HrefLinkProps) {
  return <Link to={href} {...rest}>{children}</Link>
}
