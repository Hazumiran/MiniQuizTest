/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  errorMsg?: string;
  children: any;
  footerText?: string;
  footerLink?: {
    to: string;
    label: string;
  };
}

const AuthCard = ({ title, errorMsg, children, footerText, footerLink }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md min-w-[300px] sm:min-w-[400px] p-6 sm:p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">{title}</h2>

        {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-5 rounded-md border border-red-200 shadow-sm animate-pulse">
            {errorMsg}
            </div>
        )}

        {children}

        {footerText && footerLink && (
            <div className="mt-6 text-center text-sm text-gray-600">
            {footerText}{" "}
            <Link
                to={footerLink.to}
                className="text-blue-600 font-medium hover:underline hover:text-blue-700"
            >
                {footerLink.label}
            </Link>
            </div>
        )}
        </div>
    </div>
  );
};

export default AuthCard;
