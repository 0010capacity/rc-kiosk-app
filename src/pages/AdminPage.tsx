
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, PackageOpen, Menu } from "lucide-react";
import AdminItems from "./AdminItems";
import AdminRecords from "./AdminRecords";

export default function AdminPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"records" | "items">("records");

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin-login");
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={\`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300
          \${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64 p-4\`}
      >
        <h2 className="text-lg font-bold mb-4">관리자 메뉴</h2>
        <div className="space-y-2">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">관리자 페이지</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                sessionStorage.removeItem("isAdmin");
                navigate("/admin-login");
              }}
              variant="subtle"
              size="sm"
            >
              로그아웃
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="subtle"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              돌아가기
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          {activeTab === "records" && <AdminRecords />}
          {activeTab === "items" && <AdminItems />}
        </div>
      </div>
    </div>
  );
}
