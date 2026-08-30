import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/apis/auth.api";
import { getApiErrorMessage } from "@/lib/error-helpers";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  role: "assistance",
};

export function useRegisterForm(onSuccess?: () => void) {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setRole = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const reset = () => {
    setFormData(initialFormState);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);
      await registerApi(formData);

      setSuccessMessage("تم إنشاء الحساب بنجاح!");
      setFormData(initialFormState);
      onSuccess?.();
      router.refresh();
    } catch (error: unknown) {
      console.error("خطأ أثناء التسجيل:", error);
      setErrorMessage(
        getApiErrorMessage(
          error,
          "حدث خطأ أثناء عملية التسجيل، يرجى المحاولة مرة أخرى.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    setRole,
    submit,
    reset,
    isSubmitting,
    errorMessage,
    successMessage,
  };
}