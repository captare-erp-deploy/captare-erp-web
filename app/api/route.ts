import { NextRequest, NextResponse } from 'next/server';

const FIREBIRD_HOST = process.env.FIREBIRD_HOST || '192.168.25.250';
const FIREBIRD_PORT = process.env.FIREBIRD_PORT || '6050';
const FIREBIRD_DB = process.env.FIREBIRD_DB || '/home/captarepro/dados/captare.fdb';
const FIREBIRD_USER = process.env.FIREBIRD_USER || 'SYSDBA';
const FIREBIRD_PASS = process.env.FIREBIRD_PASS || 'masterkey';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint') || 'health';
  
  if (endpoint === 'health') {
    return NextResponse.json({ status: 'ok', firebird: { host: FIREBIRD_HOST, port: FIREBIRD_PORT } });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const { action, data } = await req.json();
  
  if (action === 'auth/login') {
    const { email, password } = data;
    if (email === 'admin@captare.com' && password === 'admin123') {
      return NextResponse.json({ token: 'jwt_token_here', user: { id: 1, email, name: 'Admin' } });
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
