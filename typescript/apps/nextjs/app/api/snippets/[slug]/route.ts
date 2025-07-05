import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 第一引数に Request、第二引数に context を受け取るシグネチャに。
// context.params を await してから使う。
export async function GET(
  _request: Request,
  context: { params: { slug: string } }
) {
  // params が Promise の場合もあるので await 
  const { slug } = await context.params;

  const filePath = path.join(
    process.cwd(),
    'projects',
    'work',
    slug,
    'Demo.tsx'
  );

  try {
    const code = await fs.readFile(filePath, 'utf-8');
    // 生コードをそのまま返却するなら text() でも OK
    return new NextResponse(code, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `スニペット読込失敗: ${slug}` },
      { status: 404 }
    );
  }
}
