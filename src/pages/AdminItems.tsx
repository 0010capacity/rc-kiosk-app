import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabaseConfig";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GiftItem {
  id: string;
  name: string;
  category: "A" | "B";
  image_url?: string;
}

export default function AdminItems() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"A" | "B">("A");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("gift_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("기념품 목록 불러오기 실패:", error);
      } else {
        setItems(data as GiftItem[]);
      }
    };

    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("gift-images")
        .upload(fileName, imageFile);

      if (error) {
        console.error("이미지 업로드 실패:", error);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("gift-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase.from("gift_items").insert([
      { name, category, image_url: imageUrl },
    ]);

    if (error) {
      alert("기념품 추가 실패");
    } else {
      setName("");
      setCategory("A");
      setImageFile(null);
      location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase.from("gift_items").delete().eq("id", id);
      if (!error) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">기념품 목록 관리</h1>
        <Button onClick={() => navigate("/admin")} variant="ghost">
          ← 관리자 메뉴
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="기념품 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "A" | "B")}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="A">A 품목</option>
          <option value="B">B 품목</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <Upload size={16} />
          이미지 업로드:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>
        <Button onClick={handleAdd}>기념품 추가</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded relative flex flex-col items-center text-center"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded mb-2" />
            )}
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-xs text-gray-500">[{item.category}]</div>
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
