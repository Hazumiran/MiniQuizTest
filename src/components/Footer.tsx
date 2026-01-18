const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 text-gray-500 text-sm text-center py-4 border-t border-gray-200 mt-auto">
      &copy; {new Date().getFullYear()} MiniQuiz. All rights reserved.
    </footer>
  );
};

export default Footer;
