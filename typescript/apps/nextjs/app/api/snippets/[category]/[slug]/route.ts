import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 第一引数に Request、第二引数に context を受け取るシグネチャに。
// context.params を await してから使う。
export async function GET(
  _request: Request,
  context: { params: { category: string; slug: string } }
) {
  // params が Promise の場合もあるので await 
  const { category, slug } = await context.params;

  let filePath: string;
  switch (category) {
    case '3dmodel':
      filePath = path.join(
        process.cwd(),
        'projects',
        '3dmodel',
        slug,
        'app.tsx'
      );
      break;
    case 'work':
      filePath = path.join(
        process.cwd(),
        'projects',
        'work',
        slug,
        'Demo.tsx'
      );
      break;
    default:
      return NextResponse.json(
        { error: `未対応のcategory: ${category}` },
        { status: 400 }
      );
  }

  try {
    const code = await fs.readFile(filePath, 'utf-8');
    // 生コードをそのまま返却するなら text() でも OK
    return new NextResponse(code, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `スニペット読込失敗: ${category}/${slug}` },
      { status: 404 }
    );
  }
}