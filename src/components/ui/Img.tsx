import React from 'react'

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: string
  blurDataURL?: string
}

export default function Image({ src, alt, fill, priority, sizes: _sizes, quality: _quality, placeholder: _placeholder, blurDataURL: _blurDataURL, className, ...rest }: ImgProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={['absolute inset-0 w-full h-full object-cover', className].filter(Boolean).join(' ')}
        {...rest}
      />
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      {...rest}
    />
  )
}
