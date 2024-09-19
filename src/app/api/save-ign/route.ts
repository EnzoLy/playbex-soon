// app/api/save-ign/route.ts

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const { ign } = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'

    if (!ign || !ipAddress) {
      return NextResponse.json({ error: 'IGN or IP address missing' }, { status: 400 })
    }

    // Verificar si la IP ya tiene un IGN registrado
    const { data: existingIGNs, error: fetchError } = await supabase
      .from('minecraft_igns')
      .select('id')
      .eq('ip_address', ipAddress)

    if (fetchError) {
      console.error(fetchError)
      return NextResponse.json({ error: 'Error checking existing IGN' }, { status: 500 })
    }

    console.log(existingIGNs)

    if (existingIGNs.length > 0) {
      return NextResponse.json({ error: 'You already confirmed participation' }, { status: 400 })
    }

    // Guardar el nuevo IGN en Supabase
    const { error } = await supabase
      .from('minecraft_igns')
      .insert([{ ign, ip_address: ipAddress }])

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Error saving confirmation' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Confirmation saved successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
