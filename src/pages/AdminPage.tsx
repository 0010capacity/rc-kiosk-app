import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">관리자 페이지</h1>
        <Button onClick={() => navigate("/")} variant="ghost">
          ← 돌아가기
        </Button>
      </div>

      <div className="space-y-4">
        <Button className="w-full" onClick={() => navigate("/admin/records")}>선택 내역 보기</Button>
        <Button className="w-full" onClick={() => navigate("/admin/items")}>기념품 목록 편집</Button>
      </div>
    </div>
  );
}
