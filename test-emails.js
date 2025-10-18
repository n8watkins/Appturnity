// Test script for email functionality
// Run with: node test-emails.js

const apiUrl = 'http://localhost:3000/api';

async function testContactForm() {
  console.log('\n📧 Testing Contact Form Email...\n');

  try {
    const response = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User from Script',
        email: 'test@example.com',
        company: 'Test Company Inc.',
        message: 'This is a test contact form submission to verify Resend email integration is working correctly.\n\nIt should send a properly formatted email with all the contact details.',
        recaptchaToken: 'test_token',
        recommendation: {
          solutionName: 'Professional Web Solution',
          solutionType: 'Full Website',
          timeline: '6-8 weeks',
          investmentRange: '$3,000 - $7,000',
          priorityScore: 35,
          priorityLabel: '🔥 HIGH PRIORITY LEAD',
          scores: {
            budget: 4,
            urgency: 4,
            complexity: 3
          }
        }
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Contact form email sent successfully!');
    } else {
      console.log('❌ Failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error testing contact form:', error.message);
  }
}

async function testNewsletterSubscription() {
  console.log('\n📰 Testing Newsletter Subscription Email...\n');

  try {
    const response = await fetch(`${apiUrl}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'newsletter-test@example.com',
        recaptchaToken: 'test_token',
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Newsletter subscription email sent successfully!');
    } else {
      console.log('❌ Failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error testing newsletter:', error.message);
  }
}

async function testChatWidget() {
  console.log('\n💬 Testing Chat Widget Email...\n');

  try {
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Chat Test User',
        email: 'chat-test@example.com',
        message: 'This is a test message from the chat widget. Testing the Resend integration!',
        suggestions: ['Custom Web App', 'E-commerce Platform', 'API Integration'],
        recaptchaToken: 'test_token',
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Chat widget email sent successfully!');
    } else {
      console.log('❌ Failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error testing chat widget:', error.message);
  }
}

// Run all tests
(async () => {
  console.log('🧪 Starting Email Integration Tests...');
  console.log('=' .repeat(60));

  await testContactForm();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testNewsletterSubscription();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testChatWidget();

  console.log('\n' + '='.repeat(60));
  console.log('🏁 All tests completed!');
  console.log('\n💡 Check your email at nathancwatkins23@gmail.com');
  console.log('   Or check the server console for development mode output\n');
})();
