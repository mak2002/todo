import { useFormspark } from "@formspark/use-formspark";
import React, { useState } from "react";

export default function Form() {
  const [submit, submitting] = useFormspark({
    formId: "267uTFfaj",
  });

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await submit({ message: email });
    setSubmitted(true);
    console.log("submitted:: ", submitted);
    setEmail(""); // Clear email input after submission
  };

  return (
    <div className="w-2/6 flex justify-center flex-col">
      {!submitted && (
        <form onSubmit={onSubmit}>
          <div className="flex items-center">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-2 input-bordered w-5/6"
              placeholder="Enter your email..."
              required
            />
            <input
              type="hidden"
              name="_redirect"
              value="https://intycourses.vercel.app/vectorcourse"
            />
            <input type="hidden" name="_append" value="false" />
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary w-3/6 px-2 py-3"
            >
              <p>{submitting ? "Sending..." : <span>Join Launch List!</span>}</p>
            </button>
          </div>
        </form>
      )}
      {!submitted && (
        <p className="text-xs pt-1">
          Product updates only. No spam, I promise!
        </p>
      )}
      {submitted && (
        <p className="mt-4 text-center text-green-700 font-extrabold">
          ✅ Thank you for subscribing! Keep going ↓
        </p>
      )}
    </div>
  );
}
