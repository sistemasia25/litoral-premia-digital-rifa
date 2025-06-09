import { Clock, Gift, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
const RaffleHero = () => {
  return <div className="relative overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 w-full py-6 sm:py-12 text-center">
        <div className="mb-4 sm:mb-8 w-full">
          <img src="/banner-avelloz-2025.png" alt="Banner Sorteio Avelloz 2025 0KM" className="w-full h-auto max-h-[320px] object-cover rounded-xl shadow-lg" />
        </div>

        {/* Informações do sorteio */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-1.5 sm:p-2 min-w-[90px]">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-orange-primary mx-auto mb-0.5" />
            <p className="text-[9px] text-gray-300">Prêmio</p>
            <p className="text-[10px] sm:text-xs font-bold text-white text-center">Avelloz 2025 0km</p>
            <p className="text-[8px] text-gray-400">ou 9 mil  no </p>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-1.5 sm:p-2 min-w-[90px]">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-primary mx-auto mb-0.5" />
            <p className="text-[9px] text-gray-300">Prêmios</p>
            <p className="text-[10px] sm:text-xs font-bold text-white text-center">0,99 no com</p>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-1.5 sm:p-2 min-w-[90px]">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-primary mx-auto mb-0.5" />
            <p className="text-[9px] text-gray-300">Termina em</p>
            <p className="text-[10px] sm:text-xs font-bold text-yellow-400 text-center">1d 10h 30m</p>
          </Card>
        </div>
      </div>
    </div>;
};
export default RaffleHero;