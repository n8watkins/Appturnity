// Test script for contact form endpoint
// Run with: node test-contact-form.js

const apiUrl = "http://localhost:7223/api";

async function testContactForm() {
  console.log("\n📧 Testing Contact Form with test_token...\n");

  try {
    const response = await fetch(`${apiUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        company: "Test Company Inc.",
        message:
          "This is a test contact form submission to verify the endpoint is working correctly with test tokens in development mode.",
        recaptchaToken: "test_token", // Special test token for development
      }),
    });

    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("\n✅ Contact form test PASSED!");
      console.log("   The form submission was accepted");
      console.log("   Check your email at nathancwatkins23@gmail.com");
    } else {
      console.log("\n❌ Contact form test FAILED!");
      console.log("   Error:", data.message);
    }
  } catch (error) {
    console.error("\n❌ Network or parsing error:", error.message);
  }
}

// Run the test
testContactForm();
