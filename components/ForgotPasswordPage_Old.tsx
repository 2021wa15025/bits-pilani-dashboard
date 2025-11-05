import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bitsLogo from '../src/assets/bitsLogo';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, always show success
      setEmailSent(true);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <ImageWithFallback
                src={bitsLogo}
                alt="BITS Pilani"
                className="w-full h-auto object-contain max-w-xs mx-auto"
              />
            </div>
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What to do next:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the reset link in the email</li>
                <li>• Follow the instructions to create a new password</li>
                <li>• Return to login with your new password</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Button
                onClick={onBack}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:text-white !text-white"
              >
                Back to Login
              </Button>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground underline"
              >
                Try a different email address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <ImageWithFallback
              src={bitsLogo}
              alt="BITS Pilani"
              className="w-full h-auto object-contain max-w-xs mx-auto"
            />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset your password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your BITS email address and we'll send you instructions to reset your password.
            </p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-foreground">
                BITS Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your BITS email address"
                className="h-12 text-base"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={!email || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white dark:text-white !text-white font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-white">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending instructions...
                </div>
              ) : (
                <div className="flex items-center text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Send reset instructions
                </div>
              )}
            </Button>
          </form>
          <div className="mt-6">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If you're having trouble accessing your account, please contact:
            </p>
            <a
              href="mailto:mailadmin@wilp.bits-pilani.ac.in"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium underline"
            >
              mailadmin@wilp.bits-pilani.ac.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
