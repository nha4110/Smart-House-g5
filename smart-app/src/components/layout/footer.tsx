// smart-app/src/components/layout/footer.tsx

import React from 'react';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '', ...props }) => {
  return (
    <footer
      className={`w-full py-10 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-16 border-t border-gray-700 ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start md:items-center">
        {/* Course Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-purple-300 hover:text-purple-400 transition duration-300">
            COS20031
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Interface Design and Development - 2025
          </p>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Team Members</h3>
          <ul className="text-sm text-gray-300 font-medium space-y-1">
            {['Nhật Hoàng', 'Hoàng Long', 'Thịnh', 'Việt Anh'].map((member, i) => (
              <li
                key={i}
                className="hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1"
              >
                {member}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
