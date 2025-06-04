const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Company Registry</h3>
            <p className="text-gray-400">Register and discover businesses</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-300 transition">Terms</a>
            <a href="#" className="hover:text-blue-300 transition">Privacy</a>
            <a href="#" className="hover:text-blue-300 transition">Contact</a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Company Registry. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;