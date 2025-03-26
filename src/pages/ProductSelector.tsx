
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabaseConfig";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GiftItem {
  id: string;
  name: string;
  category: "A" | "B";
  image_url?: string;
  description?: string;
  allow_multiple?: boolean;
  visible?: boolean;
}

export default function ProductSelector() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGiftItems() {
      const { data } = await supabase
        .from("gift_items")
        .select("*")
        .eq("visible", true)
        .order("category")
        .order("sort_order");

      setGiftItems((data as GiftItem[]) || []);
    }

    fetchGiftItems();
  }, []);

  const aItems = giftItems.filter((item) => item.category === "A");
  const bItems = giftItems.filter((item) => item.category === "B");

  const handleSelect = (item: string) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemove = (item: string) => {
    setSelectedItems(selectedItems.filter(i => i !== item));
  };

  const handleReset = () => {
    setSelectedItems([]);
    setUserName("");
  };

  const handleSubmit = async () => {
    if (selectedItems.length !== 2 || !userName.trim()) return;

    const { error } = await supabase.from("gift_records").insert([
      {
        name: userName.trim(),
        items: selectedItems,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (!error) {
      alert(`${userName}님 선택 완료!`);
      handleReset();
    } else {
      console.error("저장 실패:", error);
    }
  };

  const itemCounts = selectedItems.reduce((acc: any, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  const canSubmit = selectedItems.length === 2 && userName.trim() !== "";


  return (
    <div className="space-y-6">
      <div className="rounded border p-3 bg-blue-50 text-sm text-blue-800 space-y-1">
        <p className="font-medium">🎯 선택 기준</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A 품목 1개 + B 품목 1개 선택 가능</li>
          <li>또는 B 품목 2개 선택 가능</li>
        </ul>
        {aItems.some((i) => i.allow_multiple) && (
          <>
            <p className="font-medium pt-2">📌 예외 사항</p>
            <ul className="list-disc pl-5">
              <li>
                아래 A 품목은 동일 품목을 2개까지 선택 가능:&nbsp;
                {aItems.filter((i) => i.allow_multiple).map((i) => `‘${i.name}’`).join(", ")}
              </li>
            </ul>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <label htmlFor="username" className="text-gray-700 font-medium">
          이름을 입력하세요
        </label>
        <Input
          id="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="이름 입력"
          className="w-full max-w-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {aItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-medium">{item.name}</h3>
            <Button onClick={() => handleSelect(item.name)} className="mt-2 w-full">선택</Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {bItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-medium">{item.name}</h3>
            <Button onClick={() => handleSelect(item.name)} className="mt-2 w-full">선택</Button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
        {selectedItems.length === 0 ? (
          <p className="text-gray-400 text-center">아직 선택된 기념품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(itemCounts).map(([item, count], index) => (
              <div key={index} className="flex items-center justify-between gap-3 p-2 border rounded-lg bg-gray-50 shadow-inner">
                <div className="text-gray-700 text-sm font-medium">
                  {item} {count > 1 ? `x${count}` : ""}
                </div>
                <button onClick={() => handleRemove(item)} className="text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between gap-4 mt-4">
          <Button onClick={handleReset} variant="subtle" className="w-1/2">
            초기화
          </Button>
          <Button disabled={!canSubmit} onClick={handleSubmit} className="w-1/2">
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
