import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface GiftRecord {
  name: string;
  items: string[];
}

export default function AdminPage() {
  const [records, setRecords] = useState<GiftRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "giftData"));
        const data = snapshot.docs.map((doc) => doc.data() as GiftRecord);
        setRecords(data);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">관리자 페이지</h1>
        <Button onClick={() => navigate("/")} variant="ghost">
          ← 돌아가기
        </Button>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500">선택된 기록이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {records.map((record, index) => (
            <div key={index} className="border p-4 rounded-md shadow-sm">
              <p className="font-semibold">{record.name}</p>
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
