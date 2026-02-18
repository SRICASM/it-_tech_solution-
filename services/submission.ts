/// <reference types="vite/client" />
export interface ConsultationData {
  projectType: string[];
  name: string;
  company: string;
  role: string;
  email: string;
}

/**
 * Web3Forms Integration
 *
 * Setup:
 *   1. Go to web3forms.com and enter your admin email
 *   2. Copy the access key they send you
 *   3. Paste it in .env.local as: VITE_WEB3FORMS_KEY=your-access-key
 *   4. Restart the dev server
 *
 * Every form submission will send an email to your admin address instantly.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export const submitConsultation = async (data: ConsultationData) => {
  const ref = `${(data.company || 'REQ').toUpperCase().substring(0, 3)}_${Date.now().toString().slice(-6)}`;

  if (!WEB3FORMS_KEY) {
    console.warn("Web3Forms key is not configured. Simulating submission.");
    console.log("Payload:", { name: data.name, email: data.email, company: data.company, role: data.role, ref });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, ref };
  }

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New Consultation Request - ${ref}`,
        from_name: "Neuralink Infotech Website",
        name: data.name,
        email: data.email,
        company: data.company || "-",
        service_required: data.role || "-",
        reference_id: ref,
      }),
    });

    const result = await response.json();
    return { success: result.success === true, ref: result.success ? ref : "" };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, ref: "" };
  }
};