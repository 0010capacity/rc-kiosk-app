import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, deleteDoc, doc } ;
import { db } ;
import { Trash2 } from "lucide-react";

interface GiftRecord {
  id: string;
  name: string;
  items: string[];
  timestamp?: { seconds: number; nanoseconds: number };
}

export default function AdminRecords() {
  const [records, setRecords] = useState<GiftRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "giftData"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GiftRecord[];

      data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setRecords(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "giftData", id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">선택 내역</h1>
        <Button onClick={() => navigate(-1)} variant="ghost">
          ← 돌아가기
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
                {record.name}{" "}
                <span className="text-sm text-gray-400">
                  ({record.timestamp
                    ? new Date(record.timestamp.seconds * 1000).toLocaleString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                  )
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