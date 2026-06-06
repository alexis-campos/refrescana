'use client'

import { useState, useEffect, useCallback } from 'react'
import MessagesManager from '@/components/admin/MessagesManager'
import { api } from '@/lib/api/endpoints'
import type { ContactMessage } from '@/types/api'

export function AdminMessagesPage() {
  const [messages, setMessages]     = useState<ContactMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading]       = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await api.admin.contact.list()
      setMessages(data.messages)
      setUnreadCount(data.unreadCount)
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
    <MessagesManager
      initialMessages={messages}
      unreadCount={unreadCount}
      onRefresh={load}
    />
  )
}
