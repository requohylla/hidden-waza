// PDF編集API（編集済みテキスト一覧を反映）
import { NextResponse } from 'next/server';
import { PDFDocument as PDFLibDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import fontkit from '@pdf-lib/fontkit';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const textItemsRaw = formData.get('textItems') as string;
    let textItems: { str: string; x: number; y: number; width: number; height: number }[] = [];
    if (textItemsRaw) {
      textItems = JSON.parse(textItemsRaw);
    }

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // PDF-libでアップロードPDFを読み込み
    const arrayBuffer = await file.arrayBuffer();
    const pdfLibDoc = await PDFLibDocument.load(arrayBuffer);

    // fontkit登録
    pdfLibDoc.registerFontkit(fontkit);

    const pages = pdfLibDoc.getPages();
    const pdfPage = pages[0];

    // すべてのテキスト枠について消去＋新テキスト描画
    const fontPath = process.cwd() + '/public/IPAexMincho.ttf';
    let customFont;
    try {
      const fontBytes = fs.readFileSync(fontPath);
      customFont = await pdfLibDoc.embedFont(fontBytes);
    } catch (e) {
      return NextResponse.json({ error: 'フォント埋め込み失敗: ' + String(e) }, { status: 500 });
    }

    for (const t of textItems) {
      // 元テキスト消去（白い矩形）
      pdfPage.drawRectangle({
        x: t.x,
        y: t.y - t.height,
        width: t.width,
        height: t.height,
        color: rgb(1, 1, 1),
        borderColor: rgb(1, 1, 1),
        borderWidth: 0,
        opacity: 1,
      });
      // 新テキスト描画（空文字なら描画しない＝削除のみ）
      if (t.str) {
        pdfPage.drawText(t.str, {
          x: t.x,
          y: t.y,
          size: 14,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      }
    }

    const editedPdfBytes = await pdfLibDoc.save();

    return new Response(editedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=edited.pdf',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'PDF編集APIエラー: ' + String(e) }, { status: 500 });
  }
}