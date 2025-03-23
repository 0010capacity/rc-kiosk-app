import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabaseConfig";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GiftRecord {
  id: string;
  name: string;
  items: string[];
  timestamp?: string;
}

export default function AdminRecords() {
  const [records, setRecords] = useState<GiftRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("gift_selections")
        .select("*");

      if (error) {
        console.error("데이터 로드 오류:", error);
      } else if (data) {
        const sorted = (data as GiftRecord[]).sort(
          (a, b) =>
            new Date(b.timestamp || "").getTime() -
            new Date(a.timestamp || "").getTime()
        );
        setRecords(sorted);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from("gift_selections")
        .delete()
        .eq("id", id);

      if (!error) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("삭제 실패");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">기념품 선택 기록</h1>
        <Button onClick={() => navigate("/admin")} variant="ghost">
          ← 관리자 메뉴
        </Button>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500">선택된 기록이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="border p-4 rounded-md shadow-sm relative">
              <button
                onClick={() => handleDelete(record.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <p className="font-semibold">
                {record.name}
                <span className="text-sm text-gray-400 ml-2">
                  ({new Date(record.timestamp || "").toLocaleString("ko-KR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })})
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {record.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
