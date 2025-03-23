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
  sort_order?: number;
}

export default function AdminItems() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"A" | "B">("A");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("gift_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("기념품 목록 불러오기 실패:", error);
    } else {
      setItems(data as GiftItem[]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("gift-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("이미지 업로드 실패:", uploadError);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("gift-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    const { data: maxItem } = await supabase
      .from("gift_items")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder = (maxItem?.[0]?.sort_order ?? 0) + 1;

    const { error } = await supabase.from("gift_items").insert([
      {
        name,
        category,
        image_url: imageUrl,
        sort_order: nextSortOrder,
      },
    ]);

    if (error) {
      alert("기념품 추가 실패");
    } else {
      setName("");
      setCategory("A");
      setImageFile(null);
      fetchItems();
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

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const currentItem = newItems[index];
    const targetItem = newItems[targetIndex];

    // sort_order 서로 교환
    const { error: error1 } = await supabase
      .from("gift_items")
      .update({ sort_order: targetItem.sort_order })
      .eq("id", currentItem.id);

    const { error: error2 } = await supabase
      .from("gift_items")
      .update({ sort_order: currentItem.sort_order })
      .eq("id", targetItem.id);

    if (!error1 && !error2) {
      fetchItems();
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
        {items.map((item, index) => (
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
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveItem(index, "up")}
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveItem(index, "down")}
              >
                ↓
              </Button>
            </div>
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
