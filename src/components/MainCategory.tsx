import TableCell from './TableCell.tsx';
import useFetchData from './useFetchData.tsx';
import TableHeader from './TableHeader.tsx';

const MainCategory = () => {

  const apiEndpoint = 'http://localhost:3000/SOP';
  const { data, isLoading, error } = useFetchData(apiEndpoint);

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-xl font-semibold">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-full justify-center items-center text-red-600">
        <p className="text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-xl font-semibold">No data available.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-pink-100 justify-center">
      <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <header className="bg-blue-600 text-white p-6 sm:p-8 text-center rounded-t-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold">Rencana Aksi Pembangunan Zona Integritas</h1>
          <h2 className="text-xl sm:text-2xl font-light mt-2">BPS Kota Batu Tahun 2025</h2>
        </header>

        <main className="p-6 sm:p-8">
          <section className="mb-8">
            <div className="w-full">
              <div>
                <h3 className="text-3xl font-semibold mb-4 text-gray-800">Manajemen Perubahan</h3>
              </div>
              <TableHeader />

              {data.map((item) => (
                <div>
                  <div key={item.id} className="flex h-full border-l-2 border-blue-200">
                    <div className="flex w-7/40">
                      <div className="w-1/7"><TableCell text={item.id} /></div>
                      <div className="w-6/7"><TableCell text={item.rencanaAksi} /></div>
                    </div>
                    <div className="flex-col w-33/40">
                      {item.rincianKegiatan.map((rincian) => (
                        <div key={rincian.id} className="flex">
                          <div className="w-1/13"><TableCell text={rincian.id} /></div>
                          <div className="w-12/13"><TableCell text={rincian.uraian} /></div>
                          <div className="w-4/13"><TableCell text={rincian.output} /></div>
                          <div className="w-2/13"><TableCell text={rincian.jumlah} /></div>
                          <div className="w-4/13"><TableCell text={rincian.quarter} /></div>
                          <div className="w-4/13"><TableCell text={rincian.pic} /></div>
                          <div className="w-6/13"><TableCell text={rincian.keterangan} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MainCategory;