import { Link } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed top-15 left-0 z-40 w-64 h-full transition-transform duration-300 bg-neutral-primary-soft border-e border-default
        ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/history"
              className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              onClick={() => setOpen(false)}
            >
              History Quiz
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
