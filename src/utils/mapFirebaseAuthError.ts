interface FirebaseErrorLike {
  code?: string;
}

export function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === "object" && error !== null
      ? (error as FirebaseErrorLike).code
      : undefined;

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled";
    case "auth/network-request-failed":
      return "Network issue. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Login failed. Please try again.";
  }
}
