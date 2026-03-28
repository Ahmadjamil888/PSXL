import Papa from "papaparse";
import type { Trade, TradeInput } from "@/hooks/useTrades";

// ── CSV Export ──────────────────────────────────────────────────────────────

export function exportTradesToCSV(trades: Trade[], filename = "trades.csv") {
  const rows = trades.map((t) => ({
    date: t.date,
    symbol: t.symbol,
    side: t.side,
    quantity: t.quantity,
    entry_price: t.entry_price,
    exit_price: t.exit_price ?? "",
    fees: t.fees ?? 0,
    note: t.note ?? "",
  }));

  const csv = Papa.unparse(rows);
  downloadBlob(csv, filename, "text/csv");
}

// ── CSV Import ──────────────────────────────────────────────────────────────

export interface ImportResult {
  trades: TradeInput[];
  errors: string[];
}

export function parseCSV(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const trades: TradeInput[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, i: number) => {
          const lineNum = i + 2; // 1-indexed + header row
          const symbol = String(row.symbol ?? row.Symbol ?? "").trim().toUpperCase();
          const side = String(row.side ?? row.Side ?? "").trim().toLowerCase();
          const quantity = Number(row.quantity ?? row.Quantity ?? row.qty ?? row.Qty);
          const entry_price = Number(row.entry_price ?? row["Entry Price"] ?? row.entry ?? row.Entry);
          const exit_price = row.exit_price ?? row["Exit Price"] ?? row.exit ?? row.Exit;
          const fees = Number(row.fees ?? row.Fees ?? 0);
          const note = String(row.note ?? row.Note ?? "").trim();
          const date = String(row.date ?? row.Date ?? "").trim();

          if (!symbol) { errors.push(`Row ${lineNum}: missing symbol`); return; }
          if (side !== "buy" && side !== "sell") { errors.push(`Row ${lineNum}: side must be "buy" or "sell"`); return; }
          if (!quantity || isNaN(quantity)) { errors.push(`Row ${lineNum}: invalid quantity`); return; }
          if (!entry_price || isNaN(entry_price)) { errors.push(`Row ${lineNum}: invalid entry_price`); return; }

          trades.push({
            symbol,
            side: side as "buy" | "sell",
            quantity,
            entry_price,
            exit_price: exit_price && String(exit_price).trim() !== "" ? Number(exit_price) : null,
            fees: isNaN(fees) ? 0 : fees,
            note: note || undefined,
            date: date || undefined,
          });
        });

        resolve({ trades, errors });
      },
      error: (err) => resolve({ trades: [], errors: [err.message] }),
    });
  });
}

// ── PDF Text Extraction ─────────────────────────────────────────────────────
// Extracts raw text from a PDF and tries to parse trade rows from it.
// Expected format per line: DATE SYMBOL SIDE QTY ENTRY [EXIT] [FEES]

export async function parsePDF(file: File): Promise<ImportResult> {
  const errors: string[] = [];
  const trades: TradeInput[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    // Dynamic import to avoid bundling pdfjs worker at startup
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    // Try to parse lines that look like trade rows
    const lines = fullText.split(/\n/);
    lines.forEach((line, i) => {
      const parts = line.trim().split(/\s+/);
      // Minimum: DATE SYMBOL SIDE QTY ENTRY
      if (parts.length < 5) return;
      const [dateRaw, symbol, sideRaw, qtyRaw, entryRaw, exitRaw, feesRaw] = parts;
      const date = dateRaw.match(/^\d{4}-\d{2}-\d{2}$/) ? dateRaw : undefined;
      const side = sideRaw?.toLowerCase();
      if (side !== "buy" && side !== "sell") return;
      const quantity = Number(qtyRaw);
      const entry_price = Number(entryRaw);
      if (isNaN(quantity) || isNaN(entry_price)) return;

      trades.push({
        symbol: symbol.toUpperCase(),
        side: side as "buy" | "sell",
        quantity,
        entry_price,
        exit_price: exitRaw && !isNaN(Number(exitRaw)) ? Number(exitRaw) : null,
        fees: feesRaw && !isNaN(Number(feesRaw)) ? Number(feesRaw) : 0,
        date,
      });
    });

    if (trades.length === 0) {
      errors.push("No trade rows found in PDF. Expected format per line: DATE SYMBOL SIDE QTY ENTRY [EXIT] [FEES]");
    }
  } catch (err: any) {
    errors.push(`PDF parse error: ${err.message}`);
  }

  return { trades, errors };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
