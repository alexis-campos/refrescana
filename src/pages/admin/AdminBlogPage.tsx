'use client'

import { useState, useEffect, useCallback } from 'react'
import BlogManager from '@/components/admin/BlogManager'
import { api } from '@/lib/api/endpoints'
import type { BlogPost } from '@/types/api'

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await api.admin.blog.list()
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
    </div>
  )

  return (
    <BlogManager
      initialPosts={posts}
      onRefresh={load}
    />
  )
}
