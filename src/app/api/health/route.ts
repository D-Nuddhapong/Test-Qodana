import arcjet, { detectBot, fixedWindow } from '@arcjet/next'
import { NextResponse } from 'next/server'

const aj = arcjet({
  key: process.env.ARCJET_KEY ?? '',
  rules: [
    fixedWindow({
      mode: 'LIVE',
      window: '1h',
      max: 60
    }),
    detectBot({
      mode: 'LIVE',
      block: ['AUTOMATED', 'LIKELY_AUTOMATED']
    })
  ]
})

export async function GET(req: Request) {
  const decision = await aj.protect(req)
  if (decision.isErrored()) {
    console.warn('Arcjet error', decision.reason.message)
  }

  if (decision.isDenied()) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

  return NextResponse.json({ message: 'ok' }, { status: 200 })
}
