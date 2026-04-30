import { motion, AnimatePresence } from "framer-motion";
import { startTransition, type FormEvent, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useToasts } from "../hooks/useToasts";
import { mapFirebaseAuthError } from "../utils/mapFirebaseAuthError";

interface FormState {
  email: string;
  password: string;
}

const initialFormState: FormState = {
  email: "",
  password: "",
};

const emailPattern = /\S+@\S+\.\S+/;

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      style={{ width: 20, height: 20, flexShrink: 0 }}
    >
      <path
        d="M21.805 12.23c0-.69-.062-1.35-.177-1.983H12v3.75h5.498a4.704 4.704 0 0 1-2.04 3.086v2.562h3.3c1.93-1.777 3.047-4.4 3.047-7.415Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.073-.915 6.764-2.476l-3.3-2.562c-.914.613-2.082.976-3.464.976-2.664 0-4.92-1.8-5.726-4.22H2.862v2.643A10.215 10.215 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.274 13.718A6.132 6.132 0 0 1 5.954 12c0-.596.109-1.174.32-1.718V7.64H2.862A10.214 10.214 0 0 0 1.8 12c0 1.633.39 3.18 1.062 4.36l3.412-2.642Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.062c1.503 0 2.853.518 3.915 1.535l2.935-2.936C17.068 3.01 14.755 2 12 2A10.215 10.215 0 0 0 2.862 7.64l3.412 2.642c.805-2.42 3.062-4.22 5.726-4.22Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function EKGLine() {
  return (
    <svg
      viewBox="0 0 200 40"
      style={{ width: "100%", height: 32, opacity: 0.25 }}
      preserveAspectRatio="none"
    >
      <polyline
        points="0,20 30,20 40,20 50,5 55,35 60,10 65,20 100,20 130,20 140,20 150,5 155,35 160,10 165,20 200,20"
        fill="none"
        stroke="var(--app-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Login() {
  const { clearError, isInitialized, isLoading, login, loginWithGoogle, user } =
    useAuth();
  const { show } = useToasts();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});
  const [googleHovered, setGoogleHovered] = useState(false);

  const validationErrors = useMemo(() => {
    const nextErrors: Partial<FormState> = {};

    if (!formState.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(formState.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formState.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formState.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  }, [formState]);

  if (user) {
    return <Navigate replace to="/" />;
  }

  if (!isInitialized) {
    return (
      <main className="medicore-shell flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="w-full max-w-lg p-10">
          <p className="text-sm text-muted">Preparing secure sign-in...</p>
        </Card>
      </main>
    );
  }

  const handleChange = (field: keyof FormState, value: string) => {
    startTransition(() => {
      setFormState((current) => ({ ...current, [field]: value }));
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
      clearError();
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      await login(formState.email, formState.password);
      show({
        id: "toast-login-success",
        message: "Your workspace is ready.",
        title: "Welcome back",
        tone: "success",
      });
    } catch (authError) {
      show({
        id: "toast-login-error",
        message: mapFirebaseAuthError(authError),
        title: "Sign-in failed",
        tone: "error",
      });
      setFieldErrors((current) => ({ ...current }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      show({
        id: "toast-google-login-success",
        message: "Signed in with Google successfully.",
        title: "Welcome back",
        tone: "success",
      });
    } catch (authError) {
      const message = mapFirebaseAuthError(authError);
      const isCancelled =
        typeof authError === "object" &&
        authError !== null &&
        "code" in authError &&
        authError.code === "auth/popup-closed-by-user";

      show({
        id: "toast-google-login-error",
        message,
        title: isCancelled ? "Sign-in cancelled" : "Sign-in failed",
        tone: isCancelled ? "info" : "error",
      });
      setFieldErrors((current) => ({ ...current }));
    }
  };

  return (
    <main className="medicore-shell flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-xl border border-border bg-surface p-8 lg:flex lg:flex-col lg:justify-between">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.32 }}
          >
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--app-accent)" }}
              />
              medicore
            </p>
            <h1 className="mt-5 max-w-xl text-[32px] font-medium tracking-[-0.04em] text-foreground">
              Clinical operations, intelligence, and patient oversight in one
              secure workspace.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
              Built for care teams who need clear patient context, faster
              follow-up, and calm operational visibility.
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="my-4"
          >
            <EKGLine />
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.08, duration: 0.32 }}
          >
            {[
              "Track critical patients, admissions, and recovery progress in one place.",
              "Search records quickly and open focused patient detail panels.",
              "Generate AI summaries from live patient context when needed.",
            ].map((text, i) => (
              <p key={i} className="flex items-start gap-3 text-sm text-muted">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: "var(--app-accent)" }}
                />
                {text}
              </p>
            ))}
          </motion.div>
        </section>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.04, duration: 0.34 }}
        >
          <Card className="flex w-full flex-col justify-center p-6 md:p-7">
            <div className="mb-6">
              <h2 className="text-[28px] font-medium tracking-[-0.03em] text-foreground">
                Sign in to MediCore
              </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
                  id="email"
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  placeholder="care.team@medicore.com"
                  type="email"
                  value={formState.email}
                  style={{
                    caretColor: "var(--app-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--app-primary)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px var(--app-primary-soft)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                />
                <AnimatePresence>
                  {fieldErrors.email && (
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      initial={{ opacity: 0, y: -4 }}
                      className="mt-2 text-sm text-danger"
                    >
                      {fieldErrors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-subtle"
                  id="password"
                  onChange={(event) =>
                    handleChange("password", event.target.value)
                  }
                  placeholder="Enter your password"
                  type="password"
                  value={formState.password}
                  style={{
                    caretColor: "var(--app-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--app-primary)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px var(--app-primary-soft)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                />
                <AnimatePresence>
                  {fieldErrors.password && (
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      initial={{ opacity: 0, y: -4 }}
                      className="mt-2 text-sm text-danger"
                    >
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                className="w-full"
                loading={isLoading}
                size="lg"
                type="submit"
              >
                {isLoading ? "Signing you in..." : "Sign in"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-xs text-subtle">
                <span className="h-px flex-1 bg-border" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* ── Google Button ─────────────────────────────── */}
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                onHoverStart={() => setGoogleHovered(true)}
                onHoverEnd={() => setGoogleHovered(false)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="relative w-full overflow-hidden rounded-xl"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition:
                    "background 0.22s, border-color 0.22s, box-shadow 0.22s",
                  background: googleHovered
                    ? "var(--app-surface-elevated)"
                    : "var(--app-surface)",
                  border: googleHovered
                    ? "1px solid color-mix(in srgb, var(--app-primary) 55%, transparent)"
                    : "1px solid var(--app-border)",
                  boxShadow: googleHovered
                    ? "0 0 0 3px var(--app-primary-soft), var(--app-shadow)"
                    : "var(--app-shadow)",
                }}
              >
                {/* Shimmer sweep on hover */}
                {googleHovered && (
                  <motion.span
                    animate={{ x: "200%" }}
                    initial={{ x: "-100%" }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(105deg, transparent 40%, color-mix(in srgb, var(--app-primary) 8%, transparent) 50%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Google icon in a floating chip */}
                <motion.div
                  animate={{ scale: googleHovered ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: "var(--app-background)",
                    border: "1px solid var(--app-border)",
                    boxShadow: googleHovered
                      ? "0 4px 12px rgba(99,102,241,0.15)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <GoogleIcon />
                </motion.div>

                {/* Labels */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--app-text)",
                      lineHeight: 1.3,
                    }}
                  >
                    Sign in with Google
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--app-subtle)",
                      lineHeight: 1.3,
                    }}
                  >
                    Secure OAuth 2.0 · No password needed
                  </span>
                </div>

                {/* Animated arrow */}
                <motion.div
                  animate={{
                    x: googleHovered ? 3 : 0,
                    opacity: googleHovered ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.18 }}
                  style={{ marginLeft: "auto", flexShrink: 0 }}
                >
                  <svg
                    viewBox="0 0 16 16"
                    style={{ width: 15, height: 15 }}
                    fill="none"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke={
                        googleHovered
                          ? "var(--app-primary)"
                          : "var(--app-subtle)"
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.button>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
