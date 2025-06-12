
import { usePartnerStats } from './usePartnerStats';
import { usePartnerSales } from './usePartnerSales';
import { usePartnerWithdrawals } from './usePartnerWithdrawals';
import { usePartnerClicks } from './usePartnerClicks';
import { usePartnerDoorToDoor } from './usePartnerDoorToDoor';

export const usePartner = () => {
  const statsHook = usePartnerStats();
  const salesHook = usePartnerSales();
  const withdrawalsHook = usePartnerWithdrawals();
  const clicksHook = usePartnerClicks();
  const doorToDoorHook = usePartnerDoorToDoor();

  return {
    ...statsHook,
    ...salesHook,
    ...withdrawalsHook,
    ...clicksHook,
    ...doorToDoorHook,
  };
};
