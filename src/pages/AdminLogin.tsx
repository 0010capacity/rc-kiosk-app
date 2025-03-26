
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem("isAdmin", "true");
      window.location.reload();
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">관리자 로그인</h2>
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
        <Button onClick={handleLogin}>로그인</Button>
      </div>
    </div>
  );
}
