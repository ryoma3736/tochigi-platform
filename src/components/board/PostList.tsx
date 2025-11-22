'use client'
import { useState, useEffect } from 'react'

export default function PostList() {
  const [posts, setPosts] = useState([])
  useEffect(() => { fetch('/api/posts').then(r => r.json()).then(setPosts) }, [])
  return (
    <div className="space-y-4">
      {posts.map((p: any) => (
        <div key={p.id} className="p-4 border rounded">
          <h3 className="font-bold">{p.title}</h3>
          <p>{p.content}</p>
          <span className="text-sm text-gray-500">{p.comments?.length || 0}件のコメント</span>
        </div>
      ))}
    </div>
  )
}
