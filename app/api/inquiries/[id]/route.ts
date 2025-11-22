import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } })
  return NextResponse.json(inquiry)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  const inquiry = await prisma.inquiry.update({ where: { id: params.id }, data: { status } })
  return NextResponse.json(inquiry)
}
