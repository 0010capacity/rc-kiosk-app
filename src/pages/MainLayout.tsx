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
  const [activeTab, setActiveTab] = useState<
    "selector" | "records" | "items" | "login"
  >("selector");

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("isAdmin") === "true");
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setActiveTab("selector");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "records":
        return <AdminRecords />;
      case "items":
        return <AdminItems />;
      case "login":
        return <AdminLogin />;
      default:
        return <ProductSelector />;
    }
  };

  return (
    <div
      className="flex h-screen relative"
      onClick={() => sidebarOpen && setSidebarOpen(false)}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(!sidebarOpen);
        }}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <div
        className={
          "fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
          " w-64 p-4"
        }
        onClick={(e) => e.stopPropagation()}
      >
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
            <Gift className="mr-2 h-4 w-4" />상품 등록
          </Button>
          {isAdmin && (
            <>
              <Button
                variant={activeTab === "records" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab("records")}
              >
                <ClipboardList className="mr-2 h-4 w-4" />기록 보기
              </Button>
              <Button
                variant={activeTab === "items" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab("items")}
              >
                <PackageOpen className="mr-2 h-4 w-4" />상품 관리
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />로그아웃
              </Button>
            </>
          )}
          {!isAdmin && (
            <Button
              variant={activeTab === "login" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveTab("login")}
            >
              <LogIn className="mr-2 h-4 w-4" />관리자 로그인
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 w-full">{renderContent()}</div>
    </div>
  );
}
