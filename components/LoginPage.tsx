import { useState, useContext } from "react";
import { ShieldAlert } from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Eye, EyeOff, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

interface LoginPageProps {
  onLogin: (email: string, password: string, studentData?: any) => void;
  onSwitchToAdmin?: () => void;
}

export function LoginPage({ onLogin, onSwitchToAdmin }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(""); // Clear any previous errors
    
    try {
      // Use AuthContext login function
      const result = await login({ email, password, isAdmin: false });
      
      if (result.success && result.studentData) {
        // Call the App.tsx onLogin with the student data
        onLogin(result.studentData.name, password, result.studentData);
      } else {
        // Show error for invalid credentials - list available students
        setErrorMessage('Invalid credentials. Available students: 2021wa15025@wilp.bits-pilani.ac.in, 2021wa15026@wilp.bits-pilani.ac.in, 2021wa15027@wilp.bits-pilani.ac.in, 2021wa15028@wilp.bits-pilani.ac.in, 2021wa15029@wilp.bits-pilani.ac.in (password: student123)');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Login failed. Please check your internet connection and try again.');
      setIsLoading(false);
    }
  };

  // Show forgot password page if requested
  if (showForgotPassword) {
    return <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-0">
        <div className="w-full max-w-sm max-h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {/* Logo & Heading */}
          <div className="text-center mb-4">
            <ImageWithFallback
              src="/login-logo.png"
              alt="BITS Pilani Work Integrated Learning Programmes"
              className="w-full h-auto object-contain max-w-xs mx-auto"
            />
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-red-800 flex-1">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Email Address */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[#374151] text-sm">
                BITS Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onPaste={(e) => {
                  // Ensure paste event works properly
                  setTimeout(() => {
                    const pastedText = e.clipboardData?.getData('text') || '';
                    if (pastedText) {
                      setEmail(pastedText);
                    }
                  }, 0);
                }}
                placeholder="Enter your email address"
                className="h-10 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-colors text-sm"
                style={{ 
                  fontFamily: "Inter, sans-serif",
                  userSelect: "text",
                  WebkitUserSelect: "text",
                  pointerEvents: "auto"
                }}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[#374151] text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onPaste={(e) => {
                    // Ensure paste event works properly for password field too
                    setTimeout(() => {
                      const pastedText = e.clipboardData?.getData('text') || '';
                      if (pastedText) {
                        setPassword(pastedText);
                      }
                    }, 0);
                  }}
                  className="h-10 pr-10 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-colors text-sm"
                  style={{ 
                    fontFamily: "Inter, sans-serif",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    pointerEvents: "auto"
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-[#374151] cursor-pointer"
                >
                  Remember Me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#374151] hover:text-[#1F2937] underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full h-10 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <>Log In <span className="ml-2">➤</span></>
              )}
            </Button>
          </form>

          {/* Admin Portal Link */}
          {onSwitchToAdmin && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="w-full flex items-center justify-center gap-2 text-xs text-red-600 hover:text-red-700 font-medium transition-colors py-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Portal Login →
              </button>
            </div>
          )}

          {/* Login Instructions */}
          <div className="mt-2 text-center">
            <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
              <DialogTrigger asChild>
                <button className="text-[#4F46E5] hover:text-[#4338CA] text-sm font-medium transition-colors">
                  Click here for login instructions
                </button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[1400px] h-[85vh] max-h-[800px] overflow-y-auto p-8 [&>button]:hidden">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold text-blue-600 text-left mb-4">
                    Instructions
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm leading-relaxed">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold">Welcome to the WILP Portal</h2>
                  </div>

                  <div className="break-inside-avoid mb-4">
                    <p><strong>For WILP Students:</strong> Please enter your BITS Mail address containing your 11-character student id (for eg. 2021WA15025@wilp.bits-pilani.ac.in) and your date of birth (in ddmmyyyy format) as your default password.</p>
                    <p className="mt-1">For example, if your date of birth is March 1st 1990, then your password will be 01031990</p>
                  </div>

                  <div className="break-inside-avoid mb-4">
                    <p><strong>For On-campus faculty:</strong> Please enter your BITS Mail address. Your default password will be your 4-digit PSRN number, prefixed with the letter corresponding to your campus, in uppercase. (for eg. P0123, G0123, H0123 or D0123 depending on your campus)</p>
                  </div>

                  <div className="break-inside-avoid mb-4">
                    <p><strong>For Off-campus faculty:</strong> Please enter your BITS Mail address. Your default password will be your 4-digit PSRN number prefixed with 'P', irrespective of your actual location. (for eg. P0123)</p>
                  </div>

                  <div className="break-inside-avoid mb-4">
                    <p><strong>For Guest faculty:</strong> Please enter your BITS Mail address and your PAN number in uppercase as your default password. (for eg. ABCDE1234F)</p>
                  </div>

                  <div className="break-inside-avoid mb-4">
                    <p><strong>For TAs / PS2 Students:</strong> Please enter your BITS Mail address and your Student ID in uppercase as your default password. (for eg. 2011A1PS708G)</p>
                  </div>

                  <div className="break-inside-avoid mb-4 text-red-600">
                    <p>If you are unable to login to the eLearn portal with your password or have forgotten your password, <strong>please click on the "Forgot Password?" link and enter your BITS Mail address. An email with the password reset instructions will be sent to you.</strong></p>
                  </div>

                  <div className="break-inside-avoid">
                    <p>If you're unable to login to your BITS Mail account, please write to <a href="mailto:mailadmin@wilp.bits-pilani.ac.in" className="text-blue-600 underline">mailadmin@wilp.bits-pilani.ac.in</a></p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Close ✕
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Footer - Compact */}
      <div className="bg-white flex-shrink-0">
        {/* Social Media Links - Above colored stripe */}
        <div className="px-3 py-2 bg-white">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] text-[#6B7280] font-medium hidden sm:inline">Follow BITS Pilani:</span>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/bitspilani_wilp/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E1306C] hover:text-[#C13C60] transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/BitsPilaniOffCampus/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:text-[#166FE5] transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/school/bits-pilani-wilp/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:text-[#095D9E] transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/BITSPilani_WILP/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1DA1F2] hover:text-[#1A91DA] transition-colors duration-200"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Colored stripe */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-[rgba(252,175,24,1)]"></div>
          <div className="flex-1 bg-[rgba(116,194,231,1)]"></div>
          <div className="flex-1 bg-[rgba(237,30,38,1)]"></div>
        </div>
        
        {/* University Information - Below colored stripe */}
        <div className="px-3 py-2 bg-[#F8F9FA]">
          <p className="text-[10px] text-[#6B7280] text-center leading-tight">
            An institution deemed to be a University estd. vide Sec.3 of the UGC
            Act, 1956 under notification #F.12-23/63.U-2 of June 18, 1964
          </p>
        </div>
      </div>
    </div>
  );
}