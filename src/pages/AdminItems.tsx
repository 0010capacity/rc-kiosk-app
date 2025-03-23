import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2 } from "lucide-react";

interface GiftItem {
  id: string;
  name: string;
  group: "A" | "B";
  image?: string;
}

export default function AdminItems() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [name, setName] = useState("");
  const [group, setGroup] = useState<"A" | "B">("A");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "giftItems"), orderBy("group"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GiftItem[];
      setItems(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (name.trim() === "") return;
    await addDoc(collection(db, "giftItems"), {
      name: name.trim(),
      group,
      image: image.trim() || null,
    });
    setName("");
    setImage("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "giftItems", id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">기념품 목록 편집</h1>
        <Button onClick={() => navigate(-1)} variant="ghost">
          ← 돌아가기
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-2">
        <Input
          placeholder="기념품 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full sm:w-[30%]"
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value as "A" | "B")}
          className="border rounded px-2 py-1"
        >
          <option value="A">A 품목</option>
          <option value="B">B 품목</option>
        </select>
        <Input
          placeholder="이미지 URL (선택)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full sm:w-[40%]"
        />
        <Button onClick={handleAdd}>추가</Button>
      </div>

      {["A", "B"].map((grp) => (
        <div key={grp}>
          <h2 className="font-semibold mt-6">{grp} 품목</h2>
          <ul className="space-y-2 mt-2">
            {items.filter((item) => item.group === grp).map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-2 border rounded shadow-sm bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded" />
                  <span>{item.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}