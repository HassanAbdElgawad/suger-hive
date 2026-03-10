import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-new.png";
import { useLanguage } from "@/lib/language";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("login.pleaseEnterBoth"));
      return;
    }
    const result = login(email, password);
    if (result.success) {
      toast({ title: t("login.welcomeBack"), description: t("login.loggedInSuccess") });
      setLocation("/");
    } else {
      setError(result.error || t("login.loginFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFFBEB] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="SugarHive" className="w-full max-w-xs" />
          </div>
          <p className="text-[#64748B] text-sm">{t("login.signInToDashboard")}</p>
        </div>

        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("login.email")}</Label>
                <Input
                  type="email"
                  placeholder={t("placeholder.loginEmail")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-12 rounded-xl border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("login.password")}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholder.password")}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="h-12 rounded-xl border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] pr-12"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium" data-testid="text-login-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl shadow-lg shadow-orange-200/50 text-base"
                data-testid="button-login"
              >
                <LogIn size={18} className="ltr:mr-2 rtl:ml-2" />
                {t("login.signIn")}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
