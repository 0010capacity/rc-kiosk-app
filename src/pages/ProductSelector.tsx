
import './index.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { X } from "lucide-react";
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
  const { locationId } = useParams();
  const [locationName, setLocationName] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [showTooltipId, setShowTooltipId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      const { data, error } = await supabase
        .from("donation_locations")
        .select("name")
        .eq("id", locationId)
        .single();

      if (!error && data) {
        setLocationName(data.name);
      } else {
        setLocationName("알 수 없는 장소");
      }
    }

    if (locationId) fetchLocation();
  }, [locationId]);

  useEffect(() => {
    async function fetchGiftItems() {
      const { data, error } = await supabase
        .from("gift_items")
        .select("*")
        .eq("visible", true);

      if (!error && data) {
        setGiftItems(data);
      }
    }

    fetchGiftItems();
  }, []);

  return (
    <div className="flex-1 overflow-auto p-4 w-full">
      <h1 className="text-2xl font-bold text-center mb-1">기념품 선택</h1>
      {locationName && (
        <p className="text-center text-sm text-gray-500 mb-4">{locationName}</p>
      )}
      {/* 여기 아래에 기존 기념품 UI 렌더링을 넣으면 됨 */}
    </div>
  );
}
