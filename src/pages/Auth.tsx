import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Scale, Brain, Heart, ArrowRight, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { StarField } from "@/components/StarField";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<'lawyer' | 'public'>('lawyer');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const { mode, setMode } = useExperienceMode();
  const { signUp, signIn, role } = useAuth();
  const navigate = useNavigate();

  // Clear errors when switching between login/register
  useEffect(() => {
    setErrors({});
  }, [isLogin]);

  // Password strength checker
  useEffect(() => {
    if (password) {
      let strength = 0;
      let feedback = "";

      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/\d/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;

      setPasswordStrength(strength);

      if (strength < 3) {
        feedback = "Weak password";
      } else if (strength < 5) {
        feedback = "Medium strength";
      } else {
        feedback = "Strong password";
      }

      setPasswordFeedback(feedback);
    } else {
      setPasswordStrength(0);
      setPasswordFeedback("");
    }
  }, [password]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (isLogin && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!isLogin) {
      // Registration password requirements
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must contain an uppercase letter";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = "Password must contain a lowercase letter";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Password must contain a number";
      }
    }

    if (!isLogin && !displayName) {
      newErrors.displayName = "Full name is required";
    } else if (!isLogin && displayName.length < 2) {
      newErrors.displayName = "Full name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (!error) {
        // Navigate to the appropriate dashboard based on user role
        const userRole = role || 'public';
        navigate(`/dashboard/${userRole}`);
      }
    } else {
      // For registration, default to 'lawyer' role
      const { error } = await signUp(email, password, 'lawyer', displayName);
      if (!error) {
        // Navigate to lawyer dashboard
        navigate(`/dashboard/lawyer`);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleModeToggle = () => {
    setMode(mode === 'lawyer' ? 'public' : 'lawyer');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-accent flex flex-col justify-center p-8 md:p-16 relative overflow-hidden">
        <StarField className="absolute inset-12 z-0 -top-56 -right-34 rotate-12" />
        <div className="max-w-lg mx-auto space-y-10 relative z-10">
          <Link to="/" className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Legal AId</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Transform Your Legal Practice with AI-Powered Intelligence
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Legal AId combines cutting-edge artificial intelligence with
              legal expertise to deliver instant research,
              intelligent document analysis, and automated drafting for modern law firms.
            </p>
          </div>

          <div className="pt-8">
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "100+", label: "Law Firms" },
                { value: "10K+", label: "Cases Analyzed" },
                { value: "99.2%", label: "Accuracy Rate" }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none">
            <CardHeader className="space-y-2 pb-8">
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? "Sign in to your account" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin ? "Enter your credentials to access your dashboard" : "Get started with our Legal AId platform"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please correct the errors below
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        placeholder="John Smith"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className={`pl-10 h-12 ${errors.displayName ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.displayName && (
                      <p className="text-sm text-red-500">{errors.displayName}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                  {!isLogin && password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Password strength</span>
                        <span className={`text-xs ${passwordStrength < 3 ? 'text-red-500' :
                            passwordStrength < 5 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                          {passwordFeedback}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${passwordStrength < 3 ? 'bg-red-500' :
                              passwordStrength < 5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Use 8+ characters with a mix of letters, numbers & symbols
                      </p>
                    </div>
                  )}
                  {isLogin && (
                    <div className="flex justify-between items-center mt-1">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
                        onClick={() => {
                          // In a real app, this would trigger a password reset flow
                          navigate('/forgot-password');
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-12" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-6 pt-6">
              <div className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/90"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </div>


              <div className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;