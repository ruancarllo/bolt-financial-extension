import Stripe from 'stripe'

const stripe = new Stripe('your_stripe_secret_key_here', {
  apiVersion: '2023-10-16',
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'subscribe') {
    createSubscription()
      .then(() => {
        sendResponse({ success: true })
      })
      .catch((error) => {
        console.error('Subscription error:', error)
        sendResponse({ success: false, error: error.message })
      })
    return true // Indicates that the response is asynchronous
  }
})

async function createSubscription() {
  try {
    const customer = await stripe.customers.create({
      email: 'customer@example.com', // You should get this dynamically
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'your_price_id_here' }], // Replace with your actual price ID for R$20.00/month
    })

    console.log('Subscription created:', subscription.id)
    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}