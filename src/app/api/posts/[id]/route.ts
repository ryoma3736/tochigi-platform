import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id }, include: { comments: true, likes: true } })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, content } = await req.json()
  const post = await prisma.post.update({ where: { id: params.id }, data: { title, content } })
  return NextResponse.json(post)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
