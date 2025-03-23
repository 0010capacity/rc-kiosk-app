
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  allow_multiple?: boolean;
  visible?: boolean;
  description?: string;
}

export default function AdminItems() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"A" | "B">("A");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("gift_items")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error && data) {
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
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("gift-images")
        .upload(fileName, imageFile);

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from("gift-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrl?.publicUrl || "";
      }
    }

    const { data: maxItem } = await supabase
      .from("gift_items")
      .select("sort_order")
      .eq("category", category)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder = (maxItem?.[0]?.sort_order ?? 0) + 1;

    const { error } = await supabase.from("gift_items").insert([
      {
        name,
        category,
        image_url: imageUrl,
        sort_order: nextSortOrder,
        description,
        visible: true,
        allow_multiple: false,
      },
    ]);

    if (!error) {
      setName("");
      setDescription("");
      setCategory("A");
      setImageFile(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase.from("gift_items").delete().eq("id", id);
      if (!error) {
        fetchItems();
      }
    }
  };

  const handleUpdate = async (item: GiftItem, field: keyof GiftItem, value: any) => {
    const { error } = await supabase
      .from("gift_items")
      .update({ [field]: value })
      .eq("id", item.id);

    if (!error) {
      fetchItems();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">기념품 목록 관리</h1>
        <Button onClick={() => navigate("/admin")} variant="subtle">
          관리자 메뉴
        </Button>
      </div>

      <div className="space-y-2 border-b pb-6">
        <Input
          placeholder="기념품 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="기념품 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <Button onClick={handleAdd} className="px-6 py-2">기념품 추가</Button>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg bg-white shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <Input
                className="text-lg font-semibold"
                value={item.name}
                onChange={(e) => handleUpdate(item, "name", e.target.value)}
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <Textarea
              value={item.description || ""}
              onChange={(e) => handleUpdate(item, "description", e.target.value)}
              placeholder="설명 입력"
            />
            <div className="flex items-center gap-4 text-sm">
              <label>
                <input
                  type="checkbox"
                  checked={item.visible ?? true}
                  onChange={() =>
                    handleUpdate(item, "visible", !(item.visible ?? true))
                  }
                />
                &nbsp; 사용자에게 보임
              </label>
              {item.category === "A" && (
                <label>
                  <input
                    type="checkbox"
                    checked={item.allow_multiple ?? false}
                    onChange={() =>
                      handleUpdate(item, "allow_multiple", !(item.allow_multiple ?? false))
                    }
                  />
                  &nbsp; 중복 선택 허용
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
