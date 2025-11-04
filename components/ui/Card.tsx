import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('card bg-base-100 shadow-xl', className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export const CardBody = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('card-body', className)} {...props} />
    )
  }
)

CardBody.displayName = 'CardBody'
