import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

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
      .order("category", { ascending: true })
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
        allow_multiple: false,
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

  const handleToggleAllowMultiple = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("gift_items")
      .update({ allow_multiple: !current })
      .eq("id", id);

    if (!error) {
      fetchItems();
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination || source.index === destination.index) return;

    const category = type as "A" | "B";
    const categoryItems = items
      .filter((item) => item.category === category)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    const reordered = [...categoryItems];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    const updates = reordered.map((item, index) => ({
      id: item.id,
      sort_order: index + 1,
    }));

    await Promise.all(
      updates.map((u) =>
        supabase.from("gift_items").update({ sort_order: u.sort_order }).eq("id", u.id)
      )
    );

    fetchItems();
  };

  const renderCategory = (category: "A" | "B") => {
    const filtered = items
      .filter((item) => item.category === category)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{category} 품목</h2>
        <Droppable droppableId={category} type={category}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-2 gap-4"
            >
              {filtered.map((item, index) => (
                <Draggable draggableId={item.id} index={index} key={item.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border p-4 rounded relative flex flex-col items-center text-center transition-transform duration-200 ease-in-out ${
                        snapshot.isDragging ? "scale-105 shadow-lg" : ""
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 left-2 text-gray-400 cursor-grab active:cursor-grabbing"
                        title="드래그해서 이동"
                      >
                        <GripVertical size={16} />
                      </div>

                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full aspect-[2/1] object-contain bg-white rounded mb-2"
                        />
                      ) : (
                        <div className="w-full aspect-[2/1] bg-gray-200 rounded mb-2" />
                      )}

                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">[{item.category}]</div>

                      {category === "A" && (
                        <label className="mt-2 flex items-center gap-1 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={item.allow_multiple || false}
                            onChange={() =>
                              handleToggleAllowMultiple(item.id, item.allow_multiple ?? false)
                            }
                          />
                          중복 선택 허용
                        </label>
                      )}

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">기념품 목록 관리</h1>
        <Button onClick={() => navigate("/admin")} variant="secondary">
          관리자 메뉴
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
        <Button onClick={handleAdd} className="px-6 py-2">기념품 추가</Button>
      </div>

      <hr className="my-6 border-t border-gray-300" />

<DragDropContext onDragEnd={handleDragEnd}>
        {renderCategory("A")}
        {renderCategory("B")}
      </DragDropContext>
    </div>
  );
}
