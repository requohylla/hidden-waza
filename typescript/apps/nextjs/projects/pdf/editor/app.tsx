// PDF編集Reactコンポーネント（編集済みテキスト一覧をAPI送信）
'use client';

import React, { useState, useRef, useEffect } from 'react';

const FONT_SIZE = 32;

type PdfTextItem = {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function PdfEditorApp() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null);
  const [pdfTextItems, setPdfTextItems] = useState<PdfTextItem[]>([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // PDF.js CDNスクリプトをheadに追加
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // PDFプレビュー描画＋テキスト抽出＋編集内容反映
  useEffect(() => {
    const renderPreview = async () => {
      if (!pdfFile || !canvasRef.current || !window.pdfjsLib) return;
      const pdfjs = window.pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx!, viewport }).promise;

      // PDF内テキスト抽出
      const textContent = await page.getTextContent();
      const items: PdfTextItem[] = [];
      textContent.items.forEach((item: any, idx: number) => {
        if (item.str && item.transform) {
          const [a, b, c, d, e, f] = item.transform;
          items.push({
            str: item.str,
            x: e,
            y: f,
            width: item.width,
            height: item.height,
          });
        }
      });

      // 編集内容を反映して描画
      ctx!.strokeStyle = 'blue';
      items.forEach((t, idx) => {
        ctx!.strokeRect(t.x, t.y - t.height, t.width, t.height);
        ctx!.fillStyle = selectedTextIndex === idx ? 'red' : 'black';
        ctx!.font = '14px Arial';
        // 編集対象なら編集内容で描画
        if (selectedTextIndex === idx) {
          ctx!.fillText(editValue, t.x, t.y);
        } else {
          ctx!.fillText(t.str, t.x, t.y);
        }
      });
      setPdfTextItems(items);
    };
    renderPreview();
  }, [pdfFile, selectedTextIndex, editValue]);

  // PDF内テキスト枠クリックで選択
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      pdfTextItems.forEach((t, idx) => {
        if (
          mouseX >= t.x &&
          mouseX <= t.x + t.width &&
          mouseY >= t.y - t.height &&
          mouseY <= t.y
        ) {
          setSelectedTextIndex(idx);
          setEditValue(t.str);
        }
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [pdfTextItems]);

  // 編集確定ボタンでテキスト内容を反映
  const handleConfirmEdit = () => {
    if (selectedTextIndex === null) return;
    setPdfTextItems(items =>
      items.map((t, i) => (i === selectedTextIndex ? { ...t, str: editValue } : t))
    );
  };

  // サーバーサイドAPIでPDF全体編集
  const handleEditPdf = async () => {
    setApiError(null);
    if (!pdfFile) return;
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('textItems', JSON.stringify(pdfTextItems));

    const res = await fetch('/api/pdfedit', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      setEditedPdfUrl(URL.createObjectURL(blob));
    } else {
      const err = await res.json();
      setApiError(err.error || 'PDF編集に失敗しました');
    }
  };

  // 選択テキスト削除（即反映）
  const handleDeleteText = () => {
    if (selectedTextIndex === null) return;
    setPdfTextItems(items =>
      items.map((t, i) => (i === selectedTextIndex ? { ...t, str: '' } : t))
    );
    setEditValue('');
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>PDF部分テキスト編集（プレビュー反映・削除対応・全体編集）</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
            setEditedPdfUrl(null);
            setSelectedTextIndex(null);
            setApiError(null);
          }
        }}
      />
      {pdfFile && (
        <div>
          <p>選択中: {pdfFile.name}</p>
          <canvas
            ref={canvasRef}
            style={{ border: '1px solid #ccc', margin: '16px 0', cursor: 'pointer' }}
          />
          <div style={{ color: '#888', fontSize: 12 }}>
            PDF内テキスト枠をクリックで編集
          </div>
          {selectedTextIndex !== null && (
            <div style={{ margin: '8px 0' }}>
              <label>
                選択テキスト編集:
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={{ marginLeft: 8, width: 200 }}
                />
              </label>
              <button onClick={handleConfirmEdit} style={{ marginLeft: 8 }}>
                編集確定
              </button>
              <button onClick={handleDeleteText} style={{ marginLeft: 8, color: 'red' }}>
                削除（即反映）
              </button>
            </div>
          )}
          <button onClick={handleEditPdf} style={{ marginTop: 16 }}>
            編集内容をPDFに反映
          </button>
          {apiError && (
            <div style={{ color: 'red', marginTop: 8 }}>
              <strong>APIエラー:</strong> {apiError}
            </div>
          )}
        </div>
      )}
      {editedPdfUrl && (
        <div style={{ marginTop: 24 }}>
          <h3>編集後PDFダウンロード</h3>
          <a href={editedPdfUrl} download="edited.pdf" style={{ fontWeight: 'bold', fontSize: 18, color: '#1976d2' }}>
            編集済みPDFをダウンロード
          </a>
          <iframe
            src={editedPdfUrl}
            width="600"
            height="400"
            style={{ border: '1px solid #ccc', marginTop: 16 }}
            title="編集後PDFプレビュー"
          />
        </div>
      )}
    </div>
  );
}

// window.pdfjsLib型宣言
declare global {
  interface Window {
    pdfjsLib: any;
  }
}