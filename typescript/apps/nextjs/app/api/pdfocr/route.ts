// PDF OCR抽出API（PDFページ画像化→tesseract.jsでテキスト抽出）
import { NextResponse } from 'next/server';
import { PDFDocument as PDFLibDocument } from 'pdf-lib';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // PDF-libでアップロードPDFを読み込み
  const arrayBuffer = await file.arrayBuffer();
  const pdfLibDoc = await PDFLibDocument.load(arrayBuffer);
  const pages = pdfLibDoc.getPages();

  // PDFページ画像化（1ページ目）
  const pdfPage = pages[0];
  const pdfWidth = pdfPage.getWidth();
  const pdfHeight = pdfPage.getHeight();

  // SVG画像生成（PDFページサイズに合わせる）
  const svg = `
    <svg width="${pdfWidth}" height="${pdfHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${pdfWidth}" height="${pdfHeight}" fill="white"/>
    </svg>
  `;
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // OCR: PDFページ画像化→tesseract.jsでテキスト抽出
  const ocrResult = await Tesseract.recognize(pngBuffer, 'jpn', { logger: m => {} });
  const ocrText = ocrResult.data.text;

  return NextResponse.json({ text: ocrText });
}