// src/server.ts
import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { Stripe } from 'stripe';
import cors from 'cors';
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Send PaymentIntent client secret as response
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Error creating PaymentIntent' });
  }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
