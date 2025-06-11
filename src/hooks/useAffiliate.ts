import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useAffiliate = () => {
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verifica o parâmetro de referência na URL
    const ref = router.query.ref as string || localStorage.getItem('affiliateRef');
    
    if (ref) {
      setAffiliateRef(ref);
      // Salva no localStorage para manter a referência durante a navegação
      localStorage.setItem('affiliateRef', ref);
    }
  }, [router.query]);

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
