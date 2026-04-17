import express, { Router } from 'express'
import { Storage } from '../db/storage.js'

export const billingRouter = Router()

/**
 * POST /api/billing/checkout
 * Initiate a Stripe checkout session for PRO tier
 */
billingRouter.post('/checkout', async (req, res) => {
  try {
    const { userId, planId } = req.body
    
    // TODO: Integrate actual Stripe SDK
    // const session = await stripe.checkout.sessions.create({...})
    
    console.log(`💳 [Stripe Mock] Creating checkout session for user ${userId} and plan ${planId}`)
    
    res.json({ 
      sessionId: `mock_sess_${Date.now()}`,
      url: `http://localhost:5173/payment-success?session=mock_sess_${Date.now()}` 
    })
  } catch (err) {
    res.status(500).json({ error: 'Checkout initialization failed' })
  }
})

/**
 * POST /api/billing/webhook
 * Stripe webhook listener
 */
billingRouter.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  // TODO: Verify signature and process event
  // const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  console.log(`💳 [Stripe Mock] Webhook received`);
  res.json({received: true});
})
