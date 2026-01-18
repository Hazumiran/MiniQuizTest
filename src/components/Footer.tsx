const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 text-gray-500 text-sm text-center py-4 border-t border-gray-200 mt-auto flex-1 pl-0 md:pl-64">
      &copy; {new Date().getFullYear()} MiniQuiz. All rights reserved.
    </footer>
  );
};

export default Footer;
