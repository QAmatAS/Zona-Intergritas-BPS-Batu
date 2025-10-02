//TableHeader.tsx

import TableCell from "./TableCell"

const TableHeader = () => {
    return (
        <div className="flex border-l-2 border-t-2 border-gray-700 text-white">
            <div className="flex-col w-8/40 bg-[#1B3763]">
                <div className="border-r-2 border-b-2 border-white"><TableCell text="Rencana Aksi"/></div>
                <div className='flex'>
                    <div className='w-1/8 border-r-2 border-white'><TableCell text="No"/></div>
                    <div className='w-7/8 border-r-2 border-white'><TableCell text="Uraian"/></div>
                </div>
            </div>

            <div className='flex-col w-10/40 bg-[#1B3763]'>
                <div className=" border-r-2 border-b-2 border-white"><TableCell text="Rincian Kegiatan"/></div>
                <div className='flex'>
                    <div className='w-1/10 border-r-2 border-white'><TableCell text="No"/></div>
                    <div className='w-9/10 border-r-2 border-white'><TableCell text="Uraian"/></div>
                </div>
            </div>

            <div className='flex-col w-8/40 bg-[#1B3763]'>
                <div className=" border-r-2 border-b-2 border-white"><TableCell text="Taget"/></div>
                <div className='flex'>
                    <div className='w-3/8 border-r-2 border-white'><TableCell text="Output"/></div>
                    <div className='w-2/8 border-r-2 border-white'><TableCell text="Jumlah"/></div>
                    <div className='w-3/8 border-r-2 border-white'><TableCell text="Quarter"/></div>
                </div>
            </div>

            <div className='flex-col w-5/40 bg-[#1B3763]'>
                <div className=" border-r-2 border-b-2 border-white"><TableCell text="Realisasi"/></div>
                <div className='flex'>
                    <div className='w-2/5 border-r-2 border-white'><TableCell text="Jumlah"/></div>
                    <div className='w-3/5 border-r-2 border-white'><TableCell text="Quarter"/></div>
                </div>
            </div>

            <div className='flex-col w-3/40 bg-[#1B3763]'>
                <div className='h-full border-r-2 border-white'><TableCell text="Pic"/></div>
            </div>

            <div className='flex-col w-6/40 bg-[#1B3763]'>
                <div className='h-full border-r-2 border-gray-700'><TableCell text="Keterangan"/></div>
            </div>
        </div>
    )
}

export default TableHeader