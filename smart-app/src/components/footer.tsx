export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-green-400">COS20031</h2>
          <p className="text-sm text-gray-300">Interface Design and Development</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Team Members</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>Nhật Hoàng</li>
            <li>Hoàng Long</li>
            <li>Thịnh</li>
            <li>Việt Anh</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}