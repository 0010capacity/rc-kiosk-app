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
  const [showTooltipId, setShowTooltipId] = useState<string | null>(null);
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

  const countA = selectedItems.filter((item) =>
    aItems.some((a) => a.name === item)
  ).length;
  const countB = selectedItems.filter((item) =>
    bItems.some((b) => b.name === item)
  ).length;

  const isValidSelection = (itemName: string) => {
    const item = giftItems.find((i) => i.name === itemName);
    if (!item) return false;
  
    const total = selectedItems.length;
    if (total >= 2) return false;
  
    if (item.category === "A") {
      const selectedAItems = selectedItems.filter((i) =>
        aItems.some((a) => a.name === i)
      );
  
      const distinctSelectedA = [...new Set(selectedAItems)];
      const countOfThisItem = selectedItems.filter((i) => i === item.name).length;
  
      // 하나의 A 항목만 선택 중이고, 중복 허용일 경우
      if (
        (distinctSelectedA.length === 0 || (distinctSelectedA.length === 1 && distinctSelectedA[0] === item.name))
      ) {
        if (item.allow_multiple) {
          return countOfThisItem < 2;
        } else {
          return countOfThisItem < 1;
        }
      }
  
      // 이미 다른 A 항목이 선택되어 있다면 불가
      return false;
    }
  
    // B 품목은 최대 2개까지
    if (item.category === "B") {
      return total < 2;
    }
  
    return false;
  };
  

  const handleSelect = (item: string) => {
    if (isValidSelection(item)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemove = (item: string) => {
    const index = selectedItems.indexOf(item);
    if (index !== -1) {
      const updated = [...selectedItems];
      updated.splice(index, 1);
      setSelectedItems(updated);
    }
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

  const getItemCounts = (items: string[]) => {
    const counts: { [key: string]: number } = {};
    items.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  };

  const itemCounts = getItemCounts(selectedItems);
  const canSubmit = selectedItems.length === 2 && userName.trim() !== "";

  const renderItemCard = (item: GiftItem) => (
  <>
      {/* ✅ 선택 규칙 안내 영역 */}
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
                아래 A 품목은 동일 품목을 2개까지 선택하실 수 있습니다:&nbsp;
                {aItems
                  .filter((i) => i.allow_multiple)
                  .map((i) => `‘${i.name}’`)
                  .join(", ")}
              </li>
            </ul>
          </>
        )}

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

      <div>
        
        <div className="grid grid-cols-2 gap-4">{aItems.map(renderItemCard)}</div>

      <div>
        
        <div className="grid grid-cols-2 gap-4">{bItems.map(renderItemCard)}</div>

      <div>
        
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          {selectedItems.length === 0 ? (
            <p className="text-gray-400 text-center">아직 선택된 기념품이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(itemCounts).map(([item, count], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-2 border rounded-lg bg-gray-50 shadow-inner"
                >
                  <div className="text-gray-700 text-sm font-medium">
                    {item} {count > 1 ? `x${count}` : ""}
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-gray-400 hover:text-red-500"
                  >
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
    </div>
  </>
);
}
