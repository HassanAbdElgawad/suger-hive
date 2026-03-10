import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth, getInviteByCode, ROLE_LABELS } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, UserPlus, Building2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-new.png";
import { useLanguage } from "@/lib/language";

export default function Register() {
  const [, params] = useRoute("/register/:code");
  const code = params?.code || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, []);

  const invite = getInviteByCode(code);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError(t("register.fillAllFields"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("register.passwordsNoMatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("register.passwordMinLength"));
      return;
    }

    const result = register(code, name, email, password);
    if (result.success) {
      toast({ title: t("register.welcomeToSugarHive"), description: t("register.accountCreated") });
      setLocation("/");
    } else {
      setError(result.error || t("register.registrationFailed"));
    }
  };

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFFBEB] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="SugarHive" className="w-full max-w-xs" />
          </div>
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Shield className="text-red-500" size={28} />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">{t("register.invalidInvite")}</h2>
              <p className="text-[#64748B] text-sm">
                {t("register.invalidInviteDesc")}
              </p>
              <Button
                onClick={() => setLocation("/login")}
                variant="outline"
                className="mt-4 rounded-xl"
                data-testid="button-back-to-login"
              >
                {t("register.backToLogin")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFFBEB] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="SugarHive" className="w-full max-w-xs" />
          </div>
          <p className="text-[#64748B] text-sm">{t("register.createYourAccount")}</p>
        </div>

        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-6">
              <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                <Building2 className="text-[#F59E0B]" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#94A3B8] font-medium">{t("register.invitedAs")}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-[#0F172A]" data-testid="text-invite-role">{ROLE_LABELS[invite.role]}</span>
                  <span className="text-[#94A3B8]">{t("register.at")}</span>
                  <span className="text-sm font-bold text-[#F59E0B]" data-testid="text-invite-branch">{invite.branch}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("register.fullName")}</Label>
                <Input
                  type="text"
                  placeholder={t("placeholder.yourFullName")}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="h-12 rounded-xl border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
                  data-testid="input-register-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("register.email")}</Label>
                <Input
                  type="email"
                  placeholder={t("placeholder.registerEmail")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-12 rounded-xl border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
                  data-testid="input-register-email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("register.password")}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholder.minChars")}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="h-12 rounded-xl border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] pr-12"
                    data-testid="input-register-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("register.confirmPassword")}</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("placeholder.reEnterPassword")}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  className="h-12 rounded-xl border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
                  data-testid="input-register-confirm"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium" data-testid="text-register-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl shadow-lg shadow-orange-200/50 text-base"
                data-testid="button-register"
              >
                <UserPlus size={18} className="ltr:mr-2 rtl:ml-2" />
                {t("register.createAccount")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setLocation("/login")}
                className="text-sm text-[#64748B] hover:text-[#F59E0B] transition-colors"
                data-testid="link-back-to-login"
              >
                {t("register.alreadyHaveAccount")} <span className="font-bold">{t("register.signIn")}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
