"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginForm = z.infer<typeof loginSchema>;

const ADMIN_EMAIL = "sofitransservice@gmail.com";

function Toast({ message, type, onClose }: { message: string; type: "error" | "success"; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 50 }} 
      className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl z-50 backdrop-blur-sm bg-white/95 border border-gray-200"
    >
      <div className={`w-2 h-8 rounded-full ${type === "error" ? "bg-red-500" : "bg-green-500"}`} />
      <div className="flex-1">
        <p className={`font-medium ${type === "error" ? "text-red-700" : "text-green-700"}`}>
          {type === "error" ? "Erreur" : "Succès"}
        </p>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        router.push("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const stored = localStorage.getItem("admin_login_attempts");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.lockout && data.lockout > Date.now()) {
          setLockout(data.lockout - Date.now());
        } else if (data.attempts) {
          setAttempts(data.attempts);
          localStorage.removeItem("admin_login_attempts");
        }
      } catch {
        localStorage.removeItem("admin_login_attempts");
      }
    }
  }, []);

  useEffect(() => {
    if (lockout > 0) {
      const timer = setInterval(() => {
        setLockout((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            setAttempts(0);
            localStorage.removeItem("admin_login_attempts");
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockout]);

  const onSubmit = async (data: LoginForm) => {
    if (lockout > 0) return;
    
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (userCredential.user.email === ADMIN_EMAIL) {
        document.cookie = `admin_session=${userCredential.user.uid}; path=/; max-age=86400`;
        localStorage.removeItem("admin_login_attempts");
        setToast({ message: "Connexion réussie !", type: "success" });
        setTimeout(() => router.push("/admin/dashboard"), 500);
      } else {
        await signOut(auth);
        setError("Accès refusé");
      }
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      localStorage.setItem("admin_login_attempts", JSON.stringify({ 
        attempts: newAttempts, 
        lockout: newAttempts >= 3 ? Date.now() + 15 * 60 * 1000 : null 
      }));
      
      if (newAttempts >= 3) {
        setLockout(15 * 60 * 1000);
        setError("Trop de tentatives. Réessayez dans 15 minutes.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalide");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Identifiants incorrects");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/invalid-login-credentials") {
        setError("Identifiants incorrects");
      } else {
        setError("Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-700 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">STS</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Espace Administrateur</h1>
            <p className="text-gray-500 mt-2">Connectez-vous pour accéder au dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  id="email" 
                  type="email" 
                  {...register("email")}
                  disabled={lockout > 0} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                  placeholder="sofitransservice@gmail.com" 
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  {...register("password")}
                  disabled={lockout > 0} 
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                  placeholder="••••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {lockout > 0 && (
              <div className="text-center text-red-500 text-sm">
                Compte verrouillé. Réessayez dans {Math.ceil(lockout / 60000)} minute(s)...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || lockout > 0} 
              className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Connexion
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              <span className="text-red-500">{3 - attempts}</span> tentatives restantes
            </div>
          </form>
        </div>
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}