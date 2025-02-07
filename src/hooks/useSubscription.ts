import { useState, useEffect, useCallback } from 'react';
import { checkSubscriptionStatus } from '../lib/stripe';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from './useSession';

export function useSubscription(redirectIfNotSubscribed = true) {
  const [status, setStatus] = useState<'loading' | 'never_subscribed' | 'expired' | 'active'>('loading');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSession();

  const checkSubscription = useCallback(async () => {
    if (!session) {
      setStatus('never_subscribed');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Verificando status da assinatura...');
      const { status: subscriptionStatus } = await checkSubscriptionStatus();
      console.log('Status da assinatura:', subscriptionStatus);
      setStatus(subscriptionStatus);
      
      // Só redireciona se não estiver em uma rota permitida
      if (redirectIfNotSubscribed && 
          subscriptionStatus !== 'active' && 
          !['/pricing', '/payment-success', '/login'].includes(location.pathname)) {
        console.log('Redirecionando para pricing devido à assinatura:', {
          status: subscriptionStatus,
          pathname: location.pathname
        });
        navigate('/pricing', { 
          state: { from: location },
          replace: true 
        });
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      setError('Erro ao verificar assinatura');
      setStatus('never_subscribed');
      
      // Só redireciona se não estiver em uma rota permitida
      if (redirectIfNotSubscribed && 
          !['/pricing', '/payment-success', '/login'].includes(location.pathname)) {
        console.log('Redirecionando para pricing devido a erro:', {
          error,
          pathname: location.pathname
        });
        navigate('/pricing', { 
          state: { from: location },
          replace: true 
        });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, redirectIfNotSubscribed, location, session]);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      if (mounted) {
        await checkSubscription();
      }
    };

    check();

    // Verificar a assinatura a cada 5 minutos
    const interval = setInterval(check, 5 * 60 * 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [checkSubscription]);

  return { status, loading, error };
}
