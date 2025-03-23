import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminItems() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">기념품 목록 편집</h1>
        <Button onClick={() => navigate(-1)} variant="ghost">
          ← 돌아가기
        </Button>
      </div>

      <div className="text-gray-500">
        이 페이지는 추후 기념품 목록을 추가, 삭제, 수정할 수 있도록 구현될 예정입니다.
      </div>
    </div>
  );
}