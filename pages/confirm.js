// pages/confirm.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oddulakvdkuqjhlnzwil.supabase.co"; // Replace
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZHVsYWt2ZGt1cWpobG56d2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5OTg4MTgsImV4cCI6MjA1NTU3NDgxOH0.SXAAdh6ZOqnofDOlUEjo_o5cBskuxI9DdmJpxczdyaY"; // Replace
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Confirm = () => {
  const router = useRouter();

  useEffect(() => {
    const { token_hash, type, next } = router.query; //From Supabase

    if (token_hash && type) {
      const handleConfirmation = async () => {
        let sessionData = null;
        if (type === "signup") {
          const { data, error } = await supabase.auth.verifyOtp({
            type: "email", //Important to be email here
            token_hash,
          });
          sessionData = data;
        }
        if (type === "recovery") {
          //Do nothing. A user should never get to this page, but putting for safety.
        }
        if (!sessionData?.session) {
          // Handle error case, e.g., redirect to an error page
          router.push("/confirmation-error");
        } else {
          router.push(next || "/"); // Redirect after confirmation
        }
      };

      handleConfirmation();
    }
  }, [router.query]);

  return (
    <div>
      <h1>Confirming your email...</h1>
    </div>
  );
};

export default Confirm;
