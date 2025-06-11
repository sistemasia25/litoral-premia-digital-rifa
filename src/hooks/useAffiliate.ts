import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useAffiliate = () => {
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verifica o parâmetro de referência na URL
    const ref = searchParams.get('ref') || localStorage.getItem('affiliateRef');
    
    if (ref) {
      setAffiliateRef(ref);
      // Salva no localStorage para manter a referência durante a navegação
      localStorage.setItem('affiliateRef', ref);
    }
  }, [searchParams]);

  // Limpa a referência após ser utilizada
  const clearAffiliateRef = () => {
    setAffiliateRef(null);
    localStorage.removeItem('affiliateRef');
  };

  return {
    affiliateRef,
    clearAffiliateRef,
  };
};
