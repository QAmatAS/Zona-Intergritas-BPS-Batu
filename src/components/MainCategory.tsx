import TableCell from './TableCell.tsx'

const MainCategory = () => {
    return(
        <div className="flex w-full h-full bg-pink-100 justify-center">
            <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* <!-- Header Section --> */}
            <header className="bg-blue-600 text-white p-6 sm:p-8 text-center rounded-t-3xl">
                <h1 className="text-3xl sm:text-4xl font-bold">Rencana Aksi Pembangunan Zona Integritas</h1>
                <h2 className="text-xl sm:text-2xl font-light mt-2">BPS Kota Batu Tahun 2025</h2>
            </header>

        {/* <!-- Main Content Section --> */}
        <main className="p-6 sm:p-8">
            {/* <!-- Section: Manajemen Perubahan --> */}
            <section className="mb-8">
                <h3 className="text-3xl font-semibold mb-4 text-gray-800">Manajemen Perubahan</h3>
                <div className="w-full">
                        {/* Table Header */}
                        <div className="flex h-full border-2 border-r-0 border-blue-200">
                            <div className="w-7/40 h-full bg-pink-50 border-blue-200 border-r-2">Rencana Aksi</div>
                            <div className="w-13/40 h-full bg-pink-100 border-blue-200 border-r-2">Rincian Kegiatan</div>
                            <div className="w-10/40 h-full bg-pink-200 border-blue-200 border-r-2">Target</div>
                            <div className="w-4/40 h-full bg-pink-300 border-blue-200 border-r-2">Pic</div>
                            <div className="w-6/40 h-full bg-pink-400 border-blue-200 border-r-2">Keterangan</div>
                        </div>
                        {/* Table Sub Header */}
                        <div className="flex h-full border-2 border-r-0 border-blue-200 border-t-0">
                            <div className="w-1/40 h-full bg-pink-50 border-blue-200 border-r-2">No</div>
                            <div className="w-6/40 h-full bg-pink-50 border-blue-200 border-r-2">Uraian</div>
                            <div className="w-1/40 h-full bg-pink-100 border-blue-200 border-r-2">No</div>
                            <div className="w-12/40 h-full bg-pink-100 border-blue-200 border-r-2">Uraian</div>
                            <div className="w-4/40 h-full bg-pink-200 border-blue-200 border-r-2">Output</div>
                            <div className="w-2/40 h-full bg-pink-300 border-blue-200 border-r-2">jumlah</div>
                            <div className="w-4/40 h-full bg-pink-200 border-blue-200 border-r-2">Quarter</div>
                            <div className="w-4/40 h-full bg-pink-300 border-blue-200 border-r-2">Pic</div>
                            <div className="w-6/40 h-full bg-pink-400 border-blue-200 border-r-2">Keterangan</div>
                        </div>

                        {/* Isi Table */}
                        <div className="flex h-full border-l-2 border-blue-200">
                            {/* Rencana Aksi */}
                            <div className="flex w-7/40">
                                <div className="w-1/7"><TableCell text="1"/></div>
                                <div className="w-6/7"><TableCell text="Penyusunan Tim Kerja"/></div>
                            </div>
                            <div className="flex-col  w-33/40">
                                <div className="flex">
                                    <div className="w-1/13"><TableCell text="1"/></div>
                                    <div className="w-12/13"><TableCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit"/></div>
                                    <div className="w-4/13"><TableCell text="Molotov"/></div>
                                    <div className="w-2/13"><TableCell text="20"/></div>
                                    <div className="w-1/13"><TableCell text="A"/></div>
                                    <div className="w-1/13"><TableCell text="B"/></div>
                                    <div className="w-1/13"><TableCell text="C"/></div>
                                    <div className="w-1/13"><TableCell text="D"/></div>
                                    <div className="w-4/13"><TableCell text="SonMV"/></div>
                                    <div className="w-6/13"><TableCell text="Penyakit Narkoboy Rasa Stroberi"/></div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/13"><TableCell text="1"/></div>
                                    <div className="w-12/13"><TableCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit"/></div>
                                    <div className="w-4/13"><TableCell text="Molotov"/></div>
                                    <div className="w-2/13"><TableCell text="20"/></div>
                                    <div className="w-1/13"><TableCell text="A"/></div>
                                    <div className="w-1/13"><TableCell text="B"/></div>
                                    <div className="w-1/13"><TableCell text="C"/></div>
                                    <div className="w-1/13"><TableCell text="D"/></div>
                                    <div className="w-4/13"><TableCell text="SonMV"/></div>
                                    <div className="w-6/13"><TableCell text="Penyakit Narkoboy Rasa Stroberi"/></div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/13"><TableCell text="1"/></div>
                                    <div className="w-12/13"><TableCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit"/></div>
                                    <div className="w-4/13"><TableCell text="Molotov"/></div>
                                    <div className="w-2/13"><TableCell text="20"/></div>
                                    <div className="w-1/13"><TableCell text="A"/></div>
                                    <div className="w-1/13"><TableCell text="B"/></div>
                                    <div className="w-1/13"><TableCell text="C"/></div>
                                    <div className="w-1/13"><TableCell text="D"/></div>
                                    <div className="w-4/13"><TableCell text="SonMV"/></div>
                                    <div className="w-6/13"><TableCell text="Penyakit Narkoboy Rasa Stroberi"/></div>
                                </div>
                            </div>
                            {/* <div className="w-4/40 border-blue-200 border-r-2 flex items-center justify-center">Molotov</div>
                            <div className="w-2/40 border-blue-200 border-r-2 flex items-center justify-center">20</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">A</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">B</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">C</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">D</div>
                            <div className="w-4/40 border-blue-200 border-r-2 flex items-center justify-center">SonMV</div>
                            <div className="w-6/40 border-blue-200 border-r-2 flex items-center justify-center">Penyakit Narkoboy Stroberi Gila</div> */}
                        </div>

                        {/* Isi Table */}
                        <div className="flex h-full border-l-2 border-blue-200">
                            {/* Rencana Aksi */}
                            <div className="flex w-7/40">
                                <div className="w-1/7"><TableCell text="1"/></div>
                                <div className="w-6/7"><TableCell text="Penyusunan Tim Kerja"/></div>
                            </div>
                            <div className="flex-col  w-33/40">
                                <div className="flex">
                                    <div className="w-1/13"><TableCell text="1"/></div>
                                    <div className="w-12/13"><TableCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit"/></div>
                                    <div className="w-4/13"><TableCell text="Molotov"/></div>
                                    <div className="w-2/13"><TableCell text="20"/></div>
                                    <div className="w-1/13"><TableCell text="A"/></div>
                                    <div className="w-1/13"><TableCell text="B"/></div>
                                    <div className="w-1/13"><TableCell text="C"/></div>
                                    <div className="w-1/13"><TableCell text="D"/></div>
                                    <div className="w-4/13"><TableCell text="SonMV"/></div>
                                    <div className="w-6/13"><TableCell text="Penyakit Narkoboy Rasa Stroberi"/></div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/13"><TableCell text="1"/></div>
                                    <div className="w-12/13"><TableCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit"/></div>
                                    <div className="w-4/13"><TableCell text="Molotov"/></div>
                                    <div className="w-2/13"><TableCell text="20"/></div>
                                    <div className="w-1/13"><TableCell text="A"/></div>
                                    <div className="w-1/13"><TableCell text="B"/></div>
                                    <div className="w-1/13"><TableCell text="C"/></div>
                                    <div className="w-1/13"><TableCell text="D"/></div>
                                    <div className="w-4/13"><TableCell text="SonMV"/></div>
                                    <div className="w-6/13"><TableCell text="Penyakit Narkoboy Rasa Stroberi"/></div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/13"><TableCell text="1"/></div>
                                    <div className="w-12/13"><TableCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit"/></div>
                                    <div className="w-4/13"><TableCell text="Molotov"/></div>
                                    <div className="w-2/13"><TableCell text="20"/></div>
                                    <div className="w-1/13"><TableCell text="A"/></div>
                                    <div className="w-1/13"><TableCell text="B"/></div>
                                    <div className="w-1/13"><TableCell text="C"/></div>
                                    <div className="w-1/13"><TableCell text="D"/></div>
                                    <div className="w-4/13"><TableCell text="SonMV"/></div>
                                    <div className="w-6/13"><TableCell text="Penyakit Narkoboy Rasa Stroberi"/></div>
                                </div>
                            </div>
                            {/* <div className="w-4/40 border-blue-200 border-r-2 flex items-center justify-center">Molotov</div>
                            <div className="w-2/40 border-blue-200 border-r-2 flex items-center justify-center">20</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">A</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">B</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">C</div>
                            <div className="w-1/40 border-blue-200 border-r-2 flex items-center justify-center">D</div>
                            <div className="w-4/40 border-blue-200 border-r-2 flex items-center justify-center">SonMV</div>
                            <div className="w-6/40 border-blue-200 border-r-2 flex items-center justify-center">Penyakit Narkoboy Stroberi Gila</div> */}
                        </div>
                </div>
            </section>
        </main>
    </div>
        </div>
    )
}

export default MainCategory;

