import { Bell, Settings, Stethoscope } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Left - Hospital / Dashboard Title */}
        <div className="flex items-center pl-16 sm:pl-2 space-x-2">
          <Stethoscope className="h-6 w-6 text-blue-600" />
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            {user?.name
              ? `${capitalize(user.name)} Dashboard`
              : "🏥 Hospital Admin"}
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
