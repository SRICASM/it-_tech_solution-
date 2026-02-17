/// <reference types="vite/client" />
export interface ConsultationData {
  projectType: string[];
  /* techStack: string[]; Removed (Phase 2) */
  /* details: string; Removed (Phase 2) */
  name: string;
  company: string;
  role: string;
  email: string;
}

/**
 * GOOGLE SHEETS INTEGRATION INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste the following code into Code.gs:
 * 
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var data = JSON.parse(e.postData.contents);
 *      var timestamp = new Date();
 *      // Appends a new row with timestamp and form data
 *      sheet.appendRow([
 *        timestamp,
 *        data.name,
 *        data.email,
 *        data.company,
 *        data.role,
 *        data.projectType, // Sent as comma-separated string
 *        data.techStack,   // Sent as comma-separated string
 *        data.details
 *      ]);
 *      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 *    }
 * 
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Description: "Consultation Form API".
 * 7. Execute as: "Me".
 * 8. Who has access: "Anyone".
 * 9. Click "Deploy".
 * 10. Copy the "Web app URL" and paste it below as the value for GOOGLE_SCRIPT_URL.
 */
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export const submitConsultation = async (data: ConsultationData) => {
  // Format arrays for spreadsheet readability
  const payload = {
    ...data,
    projectType: data.projectType.join(', '),
  };

  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Sheets URL is not configured. Simulating submission.");
    console.log("Payload to be sent:", payload);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      ref: `${data.company.toUpperCase().substring(0, 3)}_MOCK_${Date.now().toString().slice(-4)}`
    };
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Required for Google Apps Script Web App endpoints to avoid CORS errors on client
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      ref: `${data.company.toUpperCase().substring(0, 3)}_REQ_${Date.now().toString().slice(-4)}`
    };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, ref: "" };
  }
};