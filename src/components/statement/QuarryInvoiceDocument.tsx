import React from 'react';
import { formatDateDMY, formatCurrency, formatNumber } from '../../utils/formatters';
import { User, HardHat, Phone, Truck, MapPin } from 'lucide-react';

export interface InvoiceTransactionItem {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  material: string; // 'Laterite Stone — 1st', '1st Quality', etc.
  quantity: number;
  rate: number;
  amount: number;
}

export interface DateGroupedTransactions {
  date: string;
  dateFormatted: string;
  items: InvoiceTransactionItem[];
  dailyTotal: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string; // YYYY-MM-DD or formatted
  clientCode: string;
  ownerName: string;
  driverName: string;
  phoneNumber: string;
  vehicleNumber: string;
  dateGroups: DateGroupedTransactions[];
  qualitySummary: {
    quality: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  grandTotal: number;
  amountInWords: string;
  termsNotes?: string[];
}

interface QuarryInvoiceDocumentProps {
  data: InvoiceData;
  scale?: number;
}

export const QuarryInvoiceDocument: React.FC<QuarryInvoiceDocumentProps> = ({
  data,
}) => {
  const defaultTerms = [
    'This statement shows the quantity supplied from RZ Laterite Stone Quarry 001.',
    'Rates are as per current agreement.',
    'Payment to be settled as per terms.',
    'For any queries, please contact the above number.',
  ];

  const terms = data.termsNotes && data.termsNotes.length > 0 ? data.termsNotes : defaultTerms;

  // Format material display name to match "1st Quality : 275", "2nd Quality : 275", etc.
  const formatMaterialLabel = (material: string, quantity: number) => {
    let cleanName = material;
    if (material.includes('1st')) cleanName = '1st Quality';
    else if (material.includes('2nd')) cleanName = '2nd Quality';
    else if (material.includes('3rd')) cleanName = '3rd Quality / Mury';
    return `${cleanName} : ${formatNumber(quantity)}`;
  };

  const formattedDate = formatDateDMY(data.date);

  return (
    <div
      className="invoice-master-sheet bg-white text-[#111] font-sans mx-auto relative select-text"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '12mm 14mm',
        boxSizing: 'border-box',
        color: '#111827',
      }}
    >
      {/* ============================================================ */}
      {/* 1. TOP HEADER (Visual Master Reproduction)                   */}
      {/* ============================================================ */}
      <div className="relative w-full h-[180px] rounded-[2px] overflow-hidden mb-3 border border-gray-200">
        {/* Right side background image: Laterite pit & loaded tipper truck */}
        <div
          className="absolute inset-0 bg-cover bg-right"
          style={{
            backgroundImage: `url('/images/quarry_header_truck.jpg')`,
            backgroundPosition: 'right 20% center',
            backgroundSize: 'cover',
          }}
        />

        {/* Smooth white gradient overlay: Left pure white for typography, softly fading into the quarry image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 42%, rgba(255, 255, 255, 0.88) 52%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 85%)',
          }}
        />

        {/* Top-Right Badge: MINING / MATERIALS / MOVING INDIA */}
        <div className="absolute top-4 right-5 text-right font-black text-[9px] tracking-[0.22em] text-[#0f1115] leading-[1.3] uppercase font-sans drop-shadow-sm">
          <div>MINING</div>
          <div>MATERIALS</div>
          <div>MOVING INDIA</div>
        </div>

        {/* Left Side Branding */}
        <div className="relative z-10 p-5 flex flex-col justify-between h-full max-w-[430px]">
          <div>
            {/* Bold RZ logo mark with circle-R symbol */}
            <div className="flex items-start gap-1">
              <span className="font-sans font-black text-[46px] tracking-tighter leading-none text-black select-none">
                RZ
              </span>
              <span className="text-[12px] font-bold text-black border border-black rounded-full w-4 h-4 flex items-center justify-center leading-none mt-1">
                ®
              </span>
            </div>

            {/* Application Name */}
            <div className="mt-1">
              <h1 className="font-extrabold text-[23px] tracking-tight leading-none text-black uppercase font-sans">
                LATERITE STONE
              </h1>
              <h2 className="font-extrabold text-[23px] tracking-tight leading-none text-[#B84D20] uppercase font-sans mt-0.5">
                QUARRY 001
              </h2>
            </div>
          </div>

          {/* Subtitle Slogan */}
          <div className="text-[8.5px] font-bold tracking-[0.18em] text-[#1f2937] uppercase flex items-center gap-2 pt-2 border-t border-gray-300/80">
            <span>QUALITY STONE</span>
            <span className="text-gray-400 font-normal">|</span>
            <span>RELIABLE SUPPLY</span>
            <span className="text-gray-400 font-normal">|</span>
            <span>STRONGER TOMORROW</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INVOICE TITLE SECTION (Solid Black Horizontal Bar)        */}
      {/* ============================================================ */}
      <div className="w-full bg-[#0B0D11] text-white px-5 py-2.5 rounded-[2px] flex items-center justify-between mb-3 shadow-sm">
        <div className="font-black text-[16.5px] tracking-wider uppercase text-white font-sans">
          STATEMENT OF ACCOUNTS / INVOICE
        </div>

        <div className="text-[10px] text-gray-200 font-mono tracking-tight text-right flex flex-col gap-0.5">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-gray-400 font-sans uppercase tracking-wider text-[9px]">INVOICE NO</span>
            <span className="text-gray-400">:</span>
            <span className="text-white font-bold tracking-normal">{data.invoiceNumber}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-gray-400 font-sans uppercase tracking-wider text-[9px]">DATE</span>
            <span className="text-gray-400">:</span>
            <span className="text-white font-bold tracking-normal">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-gray-400 font-sans uppercase tracking-wider text-[9px]">CLIENT CODE</span>
            <span className="text-gray-400">:</span>
            <span className="text-white font-bold tracking-normal">{data.clientCode}</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CLIENT DETAILS SECTION                                    */}
      {/* ============================================================ */}
      <div className="mb-3.5">
        {/* Angled Orange Section Heading Tab */}
        <div
          className="bg-[#B84D20] text-white font-extrabold text-[11px] tracking-wider px-4 py-1 inline-block uppercase select-none"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)',
            paddingRight: '22px',
          }}
        >
          CLIENT DETAILS
        </div>

        {/* Client Details Box */}
        <div className="border border-gray-300 rounded-b-[2px] p-3.5 bg-[#FAFBFD] flex items-center justify-between relative overflow-hidden">
          {/* Subtle background graphic for mountain watermark */}
          <div
            className="absolute right-0 top-0 bottom-0 w-80 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at right center, #B84D20 0%, transparent 70%)`,
            }}
          />

          {/* Left Column: Owner, Driver, Phone, Vehicle with clean aligned metadata */}
          <div className="grid grid-cols-[20px_100px_10px_auto] gap-y-1.5 items-center text-xs text-gray-800 flex-1 z-10">
            <User className="w-3.5 h-3.5 text-gray-800" />
            <span className="font-semibold text-gray-600">Owner Name</span>
            <span className="text-gray-500">:</span>
            <span className="font-black text-black text-[13px]">{data.ownerName}</span>

            <HardHat className="w-3.5 h-3.5 text-gray-800" />
            <span className="font-semibold text-gray-600">Driver Name</span>
            <span className="text-gray-500">:</span>
            <span className="font-bold text-gray-900 text-[12.5px]">{data.driverName}</span>

            <Phone className="w-3.5 h-3.5 text-gray-800" />
            <span className="font-semibold text-gray-600">Phone Number</span>
            <span className="text-gray-500">:</span>
            <span className="font-bold text-gray-900 font-mono">{data.phoneNumber}</span>

            <Truck className="w-3.5 h-3.5 text-gray-800" />
            <span className="font-semibold text-gray-600">Vehicle Number</span>
            <span className="text-gray-500">:</span>
            <span className="font-black text-black tracking-wide font-mono text-[12.5px]">
              {data.vehicleNumber}
            </span>
          </div>

          {/* Vertical Separator */}
          <div className="h-16 w-px bg-gray-300 mx-5 z-10" />

          {/* Right Side: Stack of stones icon + LATERITE STONE banner */}
          <div className="flex flex-col items-center justify-center text-center px-4 z-10 max-w-[210px]">
            {/* Vector Laterite Stone stack illustration */}
            <div className="w-12 h-10 mb-1 relative flex items-center justify-center">
              <svg viewBox="0 0 100 80" className="w-full h-full text-[#B84D20] fill-current">
                <path d="M25 45 L50 20 L75 45 L50 70 Z" fill="#9C3F18" />
                <path d="M10 50 L35 28 L55 50 L30 72 Z" fill="#B84D20" opacity="0.9" />
                <path d="M45 50 L68 28 L90 50 L67 72 Z" fill="#803314" opacity="0.85" />
                <path d="M32 28 L50 10 L68 28 L50 46 Z" fill="#D25C2B" />
              </svg>
            </div>
            <div className="font-black text-[11px] tracking-wider text-black uppercase font-sans">
              LATERITE STONE
            </div>
            <div className="text-[7.5px] font-bold text-gray-500 tracking-[0.14em] uppercase leading-tight mt-0.5">
              NATURAL STRENGTH<br />FOR A BETTER TOMORROW
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TRANSACTION DETAILS SECTION                               */}
      {/* ============================================================ */}
      <div className="mb-4">
        {/* Angled Orange Section Heading Tab */}
        <div
          className="bg-[#B84D20] text-white font-extrabold text-[11px] tracking-wider px-4 py-1 inline-block uppercase select-none"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)',
            paddingRight: '22px',
          }}
        >
          TRANSACTION DETAILS
        </div>

        {/* Transaction Table */}
        <div className="border border-gray-300 rounded-b-[2px] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#141720] text-white text-[11px] uppercase tracking-wider font-sans">
                <th className="py-2.5 px-4 text-center font-bold border-r border-gray-700 w-[17%]">
                  Date
                </th>
                <th className="py-2.5 px-4 text-left font-bold border-r border-gray-700 w-[33%]">
                  Description / Qty
                </th>
                <th className="py-2.5 px-3 text-center font-bold border-r border-gray-700 w-[14%]">
                  Rate (₹)
                </th>
                <th className="py-2.5 px-4 text-right font-bold border-r border-gray-700 w-[18%]">
                  Amount (₹)
                </th>
                <th className="py-2.5 px-4 text-center font-bold w-[18%]">
                  Daily Total (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.dateGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No transactions found for the selected date range.
                  </td>
                </tr>
              ) : (
                data.dateGroups.map((group, groupIdx) => {
                  return (
                    <React.Fragment key={group.date || groupIdx}>
                      {group.items.map((item, itemIdx) => {
                        const isFirstInDate = itemIdx === 0;
                        const isLastInDate = itemIdx === group.items.length - 1;

                        return (
                          <tr
                            key={item.id || `${groupIdx}-${itemIdx}`}
                            className={`border-t border-gray-300 ${
                              groupIdx % 2 === 0 ? 'bg-white' : 'bg-[#FCFCFD]'
                            }`}
                          >
                            {/* Date Column: shown once per date group via rowspan */}
                            {isFirstInDate && (
                              <td
                                rowSpan={group.items.length}
                                className="py-3 px-3 text-center font-bold font-mono text-[12px] text-black border-r border-gray-300 align-middle bg-white"
                              >
                                {group.dateFormatted || formatDateDMY(group.date)}
                              </td>
                            )}

                            {/* Description / Qty */}
                            <td className="py-2 px-4 font-semibold text-gray-900 border-r border-gray-300 text-[12px]">
                              {formatMaterialLabel(item.material, item.quantity)}
                            </td>

                            {/* Rate */}
                            <td className="py-2 px-3 text-center font-bold font-mono text-gray-900 border-r border-gray-300 text-[12px]">
                              {item.rate}
                            </td>

                            {/* Amount */}
                            <td className="py-2 px-4 text-right font-bold font-mono text-gray-900 border-r border-gray-300 text-[12px]">
                              {formatNumber(item.amount)}
                            </td>

                            {/* Daily Total: shown once per date group via rowspan */}
                            {isFirstInDate && (
                              <td
                                rowSpan={group.items.length}
                                className="py-3 px-4 text-center font-black font-mono text-[14px] text-black align-middle bg-[#FBF6EF] border-l border-gray-300"
                              >
                                {formatNumber(group.dailyTotal)}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. SUMMARY & GRAND TOTAL SECTION                             */}
      {/* ============================================================ */}
      <div className="mb-4">
        {/* Angled Orange Section Heading Tab */}
        <div
          className="bg-[#B84D20] text-white font-extrabold text-[11px] tracking-wider px-4 py-1 inline-block uppercase select-none"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)',
            paddingRight: '22px',
          }}
        >
          SUMMARY & GRAND TOTAL
        </div>

        {/* Summary Container: Left image of cut stones, Right summary table and grand total bar */}
        <div className="flex items-stretch gap-3">
          {/* Left: Authentic photograph of cut laterite blocks */}
          <div className="w-[170px] shrink-0 border border-gray-300 rounded-[2px] overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src="/images/laterite_stone_blocks.jpg"
              alt="Laterite Stone Blocks"
              className="w-full h-full object-cover min-h-[140px]"
            />
          </div>

          {/* Right: Summary table + Grand total bar */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Quality Summary Table */}
            <div className="border border-gray-300 rounded-[2px] overflow-hidden mb-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#141720] text-white text-[11px] uppercase tracking-wider font-sans">
                    <th className="py-2 px-4 text-left font-bold border-r border-gray-700 w-[30%]">
                      Quality
                    </th>
                    <th className="py-2 px-4 text-center font-bold border-r border-gray-700 w-[28%]">
                      Total Quantity (Units)
                    </th>
                    <th className="py-2 px-3 text-center font-bold border-r border-gray-700 w-[18%]">
                      Rate (₹)
                    </th>
                    <th className="py-2 px-4 text-right font-bold w-[24%]">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {data.qualitySummary.map((q, idx) => (
                    <tr
                      key={q.quality || idx}
                      className={idx % 2 === 0 ? 'bg-[#FAF4ED]' : 'bg-white'}
                    >
                      <td className="py-2 px-4 font-black text-black border-r border-gray-300 text-[12px]">
                        {q.quality}
                      </td>
                      <td className="py-2 px-4 text-center font-bold font-mono text-black border-r border-gray-300 text-[12px]">
                        {formatNumber(q.quantity)}
                      </td>
                      <td className="py-2 px-3 text-center font-bold font-mono text-black border-r border-gray-300 text-[12px]">
                        {q.rate}
                      </td>
                      <td className="py-2 px-4 text-right font-black font-mono text-black text-[12.5px]">
                        {formatNumber(q.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GRAND TOTAL AMOUNT Heavy Split Bar */}
            <div className="flex items-stretch rounded-[2px] overflow-hidden shadow-sm border border-black mb-1">
              {/* Left Box: Black */}
              <div className="bg-[#0B0D11] text-white py-2.5 px-6 flex items-center justify-center flex-1">
                <span className="font-black text-[16px] tracking-wider uppercase font-sans text-white">
                  GRAND TOTAL AMOUNT
                </span>
              </div>

              {/* Right Box: Laterite Orange */}
              <div className="bg-[#B84D20] text-white py-2 px-8 flex items-center justify-center shrink-0 min-w-[210px]">
                <span className="font-black text-[28px] tracking-tight text-white font-mono flex items-center gap-1.5">
                  <span className="text-[24px]">₹</span>
                  <span>{formatNumber(data.grandTotal)}</span>
                </span>
              </div>
            </div>

            {/* Amount In Words below the bar */}
            <div className="text-center py-1 text-gray-800 text-[11px] font-medium italic">
              ({data.amountInWords})
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. TERMS & NOTES + AUTHORISED SIGNATORY                     */}
      {/* ============================================================ */}
      <div className="flex items-end justify-between pt-2 mb-4">
        {/* Left: Terms & Notes */}
        <div className="max-w-[420px] text-[9.5px] text-[#222] leading-relaxed">
          <div className="font-extrabold text-[#111] text-[10px] mb-1">Terms & Notes:</div>
          <ol className="list-decimal pl-3.5 space-y-0.5 text-gray-700">
            {terms.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ol>
        </div>

        {/* Right: Authorised Signatory */}
        <div className="text-right flex flex-col items-end">
          <div className="w-56 border-b border-black mb-1.5" />
          <div className="font-bold text-[10.5px] text-[#111]">Authorised Signatory</div>
          <div className="font-extrabold text-[9.5px] text-[#111] uppercase tracking-wide">
            RZ LATERITE STONE QUARRY 001
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. SOLID BLACK FOOTER                                        */}
      {/* ============================================================ */}
      <div className="w-full bg-[#0B0D11] text-white px-5 py-3 rounded-[2px] flex items-center justify-between mt-auto">
        {/* Left: Location Pin & Brand Name */}
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-white shrink-0 fill-white" />
          <div>
            <div className="font-black text-[11px] tracking-wider uppercase text-white font-sans leading-none">
              RZ LATERITE STONE QUARRY 001
            </div>
            <div className="text-[7.5px] font-bold text-gray-400 tracking-[0.16em] uppercase mt-1 leading-none">
              QUALITY STONE | RELIABLE SUPPLY | STRONGER TOMORROW
            </div>
          </div>
        </div>

        {/* Center: Vector Stoned Blocks Icon */}
        <div className="hidden sm:block opacity-75">
          <svg viewBox="0 0 60 40" className="w-8 h-6 text-gray-300 fill-current">
            <path d="M20 25 L35 12 L50 25 L35 38 Z" fill="#999" />
            <path d="M10 28 L25 16 L40 28 L25 40 Z" fill="#bbb" />
            <path d="M30 28 L45 16 L60 28 L45 40 Z" fill="#777" />
          </svg>
        </div>

        {/* Right: 4 mini icons and labels */}
        <div className="flex items-center gap-4 text-[7.5px] font-bold tracking-wider text-gray-300 uppercase">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="13" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>QUARRYING</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-gray-300" />
            <span>SUPPLY</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>LOGISTICS</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>CONSTRUCTION MATERIALS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
