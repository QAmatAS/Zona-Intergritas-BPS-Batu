//TableHeader.tsx

import TableCell from "./TableCell"

const TableHeader = () => {
    return (
        <div className="flex border-l-2 border-t-2 border-white text-white">
            <div className="flex-col w-7/40 bg-[#1B3763]">
                <div><TableCell text="Rencana Aksi"/></div>
                <div className='flex'>
                    <div className='w-1/7'><TableCell text="No"/></div>
                    <div className='w-6/7'><TableCell text="Uraian"/></div>
                </div>
            </div>

            <div className='flex-col w-13/40 bg-[#1B3763]'>
                <div><TableCell text="Rincian Kegiatan"/></div>
                <div className='flex'>
                    <div className='w-1/13'><TableCell text="No"/></div>
                    <div className='w-12/13'><TableCell text="Uraian"/></div>
                </div>
            </div>

            <div className='flex-col w-10/40 bg-[#1B3763]'>
                <div><TableCell text="Taget"/></div>
                <div className='flex'>
                    <div className='w-4/10'><TableCell text="Output"/></div>
                    <div className='w-2/10'><TableCell text="Jumlah"/></div>
                    <div className='w-4/10'><TableCell text="Quarter"/></div>
                </div>
            </div>

            <div className='flex-col w-4/40 bg-[#1B3763]'>
                <div className='h-full'><TableCell text="Pic"/></div>
            </div>

            <div className='flex-col w-6/40 bg-[#1B3763]'>
                <div className='h-full'><TableCell text="Keterangan"/></div>
            </div>
        </div>
    )
}

export default TableHeader