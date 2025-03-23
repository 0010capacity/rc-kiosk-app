
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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
  const [editedItems, setEditedItems] = useState<{ [id: string]: Partial<GiftItem> }>({});
  const navigate = useNavigate();

  const fetchItems = async () => {
    const { data } = await supabase
      .from("gift_items")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    setItems((data as GiftItem[]) || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFieldChange = (id: string, field: keyof GiftItem, value: any) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: string) => {
    const updates = editedItems[id];
    if (!updates) return;
    await supabase.from("gift_items").update(updates).eq("id", id);
    setEditedItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await supabase.from("gift_items").delete().eq("id", id);
      fetchItems();
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    const currentCategory = type as "A" | "B";
    const categoryItems = items.filter((i) => i.category === currentCategory);
    const moved = [...categoryItems];
    const [dragged] = moved.splice(source.index, 1);
    moved.splice(destination.index, 0, dragged);

    await Promise.all(
      moved.map((item, i) =>
        supabase
          .from("gift_items")
          .update({ sort_order: i + 1 })
          .eq("id", item.id)
      )
    );
    fetchItems();
  };

  const renderCategory = (category: "A" | "B") => {
    const filtered = items.filter((item) => item.category === category);

    return (
      <Droppable droppableId={category} type={category}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {filtered.map((item, index) => {
              const edited = editedItems[item.id] || {};
              return (
                <Draggable draggableId={item.id} index={index} key={item.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4 border rounded shadow bg-white relative"
                    >
                      <div {...provided.dragHandleProps} className="absolute left-2 top-2 text-gray-400 cursor-grab">
                        <GripVertical size={16} />
                      </div>

                      <div className="ml-6 space-y-2">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full max-w-xs aspect-[2/1] object-contain rounded"
                          />
                        )}
                        <Input
                          value={edited.name ?? item.name}
                          onChange={(e) => handleFieldChange(item.id, "name", e.target.value)}
                        />
                        <Textarea
                          value={edited.description ?? item.description ?? ""}
                          onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                        />
                        <div className="text-sm flex gap-4">
                          <label>
                            <input
                              type="checkbox"
                              checked={edited.visible ?? item.visible ?? true}
                              onChange={() =>
                                handleFieldChange(item.id, "visible", !(edited.visible ?? item.visible ?? true))
                              }
                            />{" "}
                            사용자에게 보임
                          </label>
                          {item.category === "A" && (
                            <label>
                              <input
                                type="checkbox"
                                checked={edited.allow_multiple ?? item.allow_multiple ?? false}
                                onChange={() =>
                                  handleFieldChange(
                                    item.id,
                                    "allow_multiple",
                                    !(edited.allow_multiple ?? item.allow_multiple ?? false)
                                  )
                                }
                              />{" "}
                              중복 선택 허용
                            </label>
                          )}
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button
                            onClick={() => handleSave(item.id)}
                            disabled={!editedItems[item.id]}
                          >
                            저장
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">기념품 목록 관리</h1>
        <Button onClick={() => navigate("/admin")} variant="subtle">
          관리자 메뉴
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">A 품목</h2>
            {renderCategory("A")}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">B 품목</h2>
            {renderCategory("B")}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
