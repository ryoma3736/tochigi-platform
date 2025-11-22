'use client'
import { useState } from 'react'

export default function PostForm({ onSubmit }: { onSubmit?: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, authorId: 'user1' }) })
    setTitle(''); setContent(''); onSubmit?.()
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル" className="w-full p-2 border rounded" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="内容" className="w-full p-2 border rounded" />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">投稿</button>
    </form>
  )
}
