import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp }: SendOTPRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Healthcare App <onboarding@resend.dev>",
      to: [email],
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0891b2; margin: 0;">Healthcare App</h1>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; text-align: center;">
            <h2 style="color: #334155; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #64748b; margin-bottom: 30px; font-size: 16px;">
              Please use the following verification code to complete your registration:
            </p>
            
            <div style="background: white; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #0891b2; letter-spacing: 8px;">${otp}</span>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              This code will expire in 10 minutes for security purposes.
            </p>
            <p style="color: #64748b; font-size: 14px;">
              If you didn't request this verification code, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Healthcare App - Secure Medical Consultation Platform
            </p>
          </div>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);