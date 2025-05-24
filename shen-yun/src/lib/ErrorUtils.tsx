export function checkError(errorCode: string, setError: (message: string) => void) {
    if (errorCode) {
        if (errorCode === "auth/invalid-email") {
            setError("Invalid email format. Please check your email.");
        } else if (errorCode === "auth/email-already-in-use") {
            setError("This email is already in use. Please use a different email.");
        } else if (errorCode === "auth/weak-password") {
            setError("Password is too weak. Please use a stronger password.");
        } else if (errorCode === "auth/network-request-failed") {
            setError("Network error. Please check your internet connection.");
        } else if (errorCode === "auth/operation-not-allowed") {
            setError("This operation is not allowed. Please contact support.");
        } else if (errorCode === "auth/user-not-found") {
            setError("No account found with this email.");
        } else if (errorCode === "auth/wrong-password") {
            setError("Incorrect password. Please try again.");
        } else if (errorCode === "auth/user-disabled") {
            setError("This account has been disabled. Please contact support.");
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
    }
}