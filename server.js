import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3001;

// Configuração do CORS - Permitir todas as origens
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Configuração do Supabase
const supabaseUrl = 'https://fbtwddvbinsqhppmczkz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidHdkZHZiaW5zcWhwcG1jemt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzczNjIxOSwiZXhwIjoyMDUzMzEyMjE5fQ.l50kc7XSRHBJWZOzeapzHhRM2k3IqKqCq5VGjqqwZKM';

// Criando cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// Configuração do Stripe (modo produção)
const stripe = new Stripe('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');
const PRICE_ID = 'price_1Qpvv8B3iylY1mGJhRDUI802';

// Log de todas as requisições
app.use((req, res, next) => {
  console.log('\n=== Nova Requisição ===');
  console.log('URL:', req.url);
  console.log('Método:', req.method);
  console.log('Headers:', req.headers);
  next();
});

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Token não fornecido');
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Verificando token:', token.substring(0, 20) + '...');
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (!user) {
      console.log('Usuário não encontrado para o token');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    console.log('Usuário autenticado:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Verificar status da assinatura
app.get('/api/subscription-status', authMiddleware, async (req, res) => {
  try {
    console.log('Verificando assinatura para:', req.user.email);
    
    // Buscar cliente no Stripe pelo email
    const { data: customers } = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });

    if (!customers.length) {
      console.log('Cliente não encontrado no Stripe');
      return res.json({ status: 'never_subscribed' });
    }

    const customer = customers[0];
    console.log('Cliente Stripe:', customer.id);

    // Buscar assinaturas ativas
    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    if (!subscriptions.length) {
      console.log('Nenhuma assinatura ativa encontrada');
      return res.json({ status: 'expired' });
    }

    const subscription = subscriptions[0];
    console.log('Assinatura encontrada:', subscription.id, subscription.status);

    // Atualizar status no Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: req.user.id,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
    }

    res.json({ status: 'active' });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
});

// Criar sessão de checkout
app.post('/api/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    console.log('Criando sessão de checkout para:', req.user.email);

    // Verificar se o usuário já tem uma assinatura ativa
    const { data: customers } = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });

    let customerId;
    if (customers.length) {
      customerId = customers[0].id;
      console.log('Cliente existente:', customerId);

      // Verificar assinaturas ativas
      const { data: subscriptions } = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });

      if (subscriptions.length) {
        console.log('Usuário já tem assinatura ativa:', subscriptions[0].id);
        return res.status(400).json({ 
          error: 'Você já possui uma assinatura ativa',
          subscription: subscriptions[0]
        });
      }
    }

    // Criar a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId, // Se existir, usa o customer existente
      customer_email: customerId ? undefined : req.user.email, // Só usa email se não tiver customer
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_types: ['card'],
    });

    console.log('Sessão criada:', session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
  }
});

// Webhook do Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_your_signing_secret');

    console.log('Webhook recebido:', event.type);

    if (event.type === 'customer.subscription.created' || 
        event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription.customer);
      
      console.log('Atualizando assinatura para:', customer.email);

      // Buscar usuário pelo email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customer.email)
        .single();

      if (userError || !users) {
        console.error('Usuário não encontrado:', userError);
        return res.json({ received: true });
      }

      // Atualizar status da assinatura
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: users.id,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        });

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
