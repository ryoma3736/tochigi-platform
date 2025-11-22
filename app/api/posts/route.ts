import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { comments: true, likes: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const { title, content, authorId } = await req.json()
  const post = await prisma.post.create({
    data: { title, content, authorId },
  })
  return NextResponse.json(post)
}
