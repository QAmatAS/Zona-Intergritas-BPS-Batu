import logo from "../assets/logo.png";

const Header = () => {
  
  return (
    <div className="flex h-[90px] items-center justify-between bg-white px-[60px] md:px-10 py-4">
      {/* Logo */}
      <div className="flex items-center h-[41px]">
        <img src={logo} alt="BPS Kota Batu" className="h-[41px]" />
        <p className="text-[20px] ml-[10px]">Badan Pusat Statistik</p>
      </div>

      {/* Navbar */}
      <div className="hidden md:flex items-center h-[41px] space-x-8 text-[16px]">
        <p className="cursor-pointer">Home</p>
        <p className="cursor-pointer">Jenis Infrastruktur</p>
        <p className="cursor-pointer">About</p>
        <a href="https://bpskotabatu.com/map?kode=infrastruktur" className="flex items-center justify-center h-[41px] w-[122px] bg-[#7a3ff3] rounded-md text-white cursor-pointer">
          <p>Jelajahi Peta</p>
        </a>
        
      </div>

      {/* Hamburger Menu untuk layar kecil */}
      <div className="md:hidden">
        {/* Anda bisa menambahkan ikon hamburger di sini */}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Header;