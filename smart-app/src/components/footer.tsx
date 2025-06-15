import React from 'react';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  return (
    <footer
      className={`w-screen py-12 bg-gradient-to-b from-purple-950 via-purple-900 to-blue-900 animate-gradient text-white sticky bottom-0 min-h-[calc(100vh-80vh)] ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left backdrop-blur-md bg-white/10 border-t-2 border-purple-400/30">
        <div className="mb-8 md:mb-0">
          <h2 className="text-2xl font-extrabold text-purple-300 tracking-tight hover:text-purple-400 transition-colors duration-300">
            COS20031
          </h2>
          <p className="text-sm text-white/90 font-medium mt-2">
            Interface Design and Development
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">
            Team Members
          </h3>
          <ul className="text-sm text-white/90 font-medium space-y-2">
            {['Nhật Hoàng', 'Hoàng Long', 'Thịnh', 'Việt Anh'].map((name, index) => (
              <li
                key={index}
                className="hover:text-purple-300 transition-colors duration-300 transform hover:translate-x-1"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease-in-out infinite;
          }
          footer {
            position: relative;
            overflow: hidden;
          }
          footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(to right, transparent, rgba(192, 132, 252, 0.5), transparent);
            animation: glow-border 3s ease-in-out infinite;
          }
          @keyframes glow-border {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;