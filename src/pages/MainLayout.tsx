
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, PackageOpen, Gift, LogIn, LogOut, Menu } from "lucide-react";
import ProductSelector from "./ProductSelector";
import AdminRecords from "./AdminRecords";
import AdminItems from "./AdminItems";
import AdminLogin from "./AdminLogin";

export default function MainLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"selector" | "records" | "items" | "login">("selector");

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={
          "fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
          " w-64 p-4"
        }
      >
        <h2 className="text-lg font-bold mb-4">메뉴</h2>
        <div className="space-y-2">
          <Button
            variant={activeTab === "selector" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab("selector");
              setSidebarOpen(false);
            }}
          >
            <Gift className="mr-2" size={16} />
            기념품 선택
          </Button>
          {isAdmin && (
            <>
              <Button
                variant={activeTab === "records" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("records");
                  setSidebarOpen(false);
                }}
              >
                <ClipboardList className="mr-2" size={16} />
                기록 보기
              </Button>
              <Button
                variant={activeTab === "items" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("items");
                  setSidebarOpen(false);
                }}
              >
                <PackageOpen className="mr-2" size={16} />
                품목 관리
              </Button>
            </>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {!isAdmin ? (
            <Button
              onClick={() => {
                setActiveTab("login");
                setSidebarOpen(false);
              }}
              className="w-full"
              variant="secondary"
            >
              <LogIn className="mr-2" size={16} />
              관리자 로그인
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              className="w-full"
              variant="destructive"
            >
              <LogOut className="mr-2" size={16} />
              로그아웃
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">RC Kiosk</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          {activeTab === "selector" && <h2 className="text-2xl font-bold text-center mb-4">기념품 선택</h2>}
          {activeTab === "records" && <h2 className="text-2xl font-bold text-center mb-4">기록 보기</h2>}
          {activeTab === "items" && <h2 className="text-2xl font-bold text-center mb-4">품목 관리</h2>}
          {activeTab === "login" && <h2 className="text-2xl font-bold text-center mb-4">관리자 로그인</h2>}
          {activeTab === "login" ? <AdminLogin onBack={() => setActiveTab("selector")} /> : renderContent()}
        </div>
    
      </div>
    </div>
  );
}
