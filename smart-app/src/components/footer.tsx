import React from 'react';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '', ...props }) => {
  return (
    <footer
      className={`w-full py-10 px-4 bg-gradient-to-tr from-indigo-950 via-purple-900 to-blue-950 text-white relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start md:items-center">
        {/* Course Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-purple-300 hover:text-purple-400 transition duration-300">
            COS20031
          </h2>
          <p className="text-sm text-white/90 font-medium">
            Interface Design and Development - 2025
          </p>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Team Members</h3>
          <ul className="text-sm text-white/90 font-medium space-y-1">
            {['Nhật Hoàng', 'Hoàng Long', 'Thịnh', 'Việt Anh'].map((member, i) => (
              <li
                key={i}
                className="hover:text-purple-300 transition-colors duration-300 transform hover:translate-x-1"
              >
                {member}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px]">
        <div className="h-full w-full animate-glow bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      </div>

      {/* Keyframes & animation styling */}
      <style>{`
        @keyframes glow {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-glow {
          background-size: 200% auto;
          animation: glow 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
