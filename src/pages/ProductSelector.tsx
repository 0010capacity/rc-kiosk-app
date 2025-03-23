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
  allow_multiple?: boolean;
}

export default function ProductSelector() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGiftItems() {
      const { data, error } = await supabase
        .from("gift_items")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setGiftItems(data as GiftItem[]);
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

    if (item.category === "A") {
      if (item.allow_multiple) {
        const sameCount = selectedItems.filter((n) => n === item.name).length;
        return sameCount < 2 && total < 2;
      } else {
        return countA < 1 && total < 2;
      }
    }

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
    if (!canSubmit) return;

    const { error } = await supabase.from("gift_records").insert([
      {
        name: userName.trim(),
        items: selectedItems,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    alert(`${userName}님 선택 완료!`);
    handleReset();
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
    <Button
      key={item.name}
      onClick={() => handleSelect(item.name)}
      disabled={!isValidSelection(item.name)}
      variant="outline"
      className="flex flex-col items-center space-y-2 p-3 h-auto relative"
    >
      {/* ✅ 뱃지 표시 */}
      {item.allow_multiple && (
        <span className="absolute top-1 right-1 text-[10px] bg-yellow-300 text-gray-800 px-1.5 py-0.5 rounded font-medium shadow-sm">
          🔁 중복 선택 가능
        </span>
      )}

      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full aspect-[2/1] object-contain bg-white rounded"
        />
      ) : (
        <div className="w-full aspect-[2/1] bg-gray-200 rounded" />
      )}
      <span className="text-sm text-center">{item.name}</span>
    </Button>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* ✅ 헤더 및 관리자 페이지 이동 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">기념품 선택</h1>
        <Button variant="subtle" onClick={() => navigate("/admin")}>
          관리자 메뉴
        </Button>
      </div>

      {/* ✅ 선택 안내 (개조식 + 예외 표기) */}
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
      </div>

      {/* ✅ 사용자 이름 입력 */}
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

      {/* ✅ A / B 품목 선택 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">A 품목</h2>
        <div className="grid grid-cols-2 gap-4">{aItems.map(renderItemCard)}</div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">B 품목</h2>
        <div className="grid grid-cols-2 gap-4">{bItems.map(renderItemCard)}</div>
      </div>

      {/* ✅ 선택된 항목 요약 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">선택된 기념품</h2>
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
        </div>
      </div>

      {/* ✅ 하단 버튼 */}
      <div className="flex justify-between gap-4">
        <Button onClick={handleReset} variant="subtle" className="w-1/2">
          초기화
        </Button>
        <Button disabled={!canSubmit} onClick={handleSubmit} className="w-1/2">
          완료
        </Button>
      </div>
    </div>
  );
}
