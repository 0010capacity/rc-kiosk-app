import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ClipboardList,
  PackageOpen,
  Gift,
  LogIn,
  LogOut,
  Menu,
} from "lucide-react";
import ProductSelector from "./ProductSelector";
import AdminRecords from "./AdminRecords";
import AdminItems from "./AdminItems";
import AdminLogin from "./AdminLogin";

export default function MainLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"selector" | "records" | "items" | "login">(() => {
    return (localStorage.getItem("activeTab") as any) || "selector";
  });
  
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);  

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("isAdmin") === "true");
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setActiveTab("selector");
  };

  const renderTitle = () => {
    switch (activeTab) {
      case "records":
        return "선택 기록";
      case "items":
        return "상품 관리";
      case "login":
        return "";
      default:
        return "기념품 선택";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "records":
        return <AdminRecords />;
      case "items":
        return <AdminItems />;
      case "login":
        return <AdminLogin onBack={() => setActiveTab("selector")} />;
      default:
        return <ProductSelector />;
    }
  };

  return (
    <div
      className="flex min-h-screen relative"
      onClick={() => sidebarOpen && setSidebarOpen(false)}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(!sidebarOpen);
        }}
        className="fixed top-4 left-4 z-30 p-2 bg-white rounded-full shadow-md"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <div
        className={
          "fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
          " w-64 p-4 flex flex-col justify-between"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">메뉴</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>
          <div className="space-y-2">
            <Button
              variant={activeTab === "selector" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveTab("selector")}
            >
              <Gift className="mr-2 h-4 w-4" />기념품 선택
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant={activeTab === "records" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("records")}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />선택 기록
                </Button>
                <Button
                  variant={activeTab === "items" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("items")}
                >
                  <PackageOpen className="mr-2 h-4 w-4" />상품 관리
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="pt-4 border-t">
          {isAdmin ? (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />로그아웃
            </Button>
          ) : (
            <Button
              variant={activeTab === "login" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveTab("login")}
            >
              <LogIn className="mr-2 h-4 w-4" />로그인
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 w-full">
        <h1 className="text-2xl font-bold text-center mb-6">{renderTitle()}</h1>
        {renderContent()}
      </div>
    </div>
  );
}
