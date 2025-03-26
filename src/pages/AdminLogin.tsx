import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabaseConfig";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminLogin({ onBack }: { onBack: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("user_auth")
      .select("password")
      .eq("username", username)
      .single();

    if (error) {
      alert("서버 오류가 발생했습니다.");
      console.error(error);
      return;
    }

    if (data && data.password === password) {
      sessionStorage.setItem("isAdmin", "true");
      window.location.reload();
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4">
        <Input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-between">
          <Button onClick={onBack} variant="outline">
            돌아가기
          </Button>
          <Button onClick={handleLogin}>
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}