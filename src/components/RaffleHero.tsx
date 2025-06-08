import { Clock, Gift, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const RaffleHero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="mb-8"> {/* Container para o banner */}
          <img 
            src="/banner-avelloz-2025.png" 
            alt="Banner Sorteio Avelloz 2025 0KM" 
            className="w-full h-auto object-contain rounded-lg" /* Adicionado rounded-lg para consistência visual */
          />
        </div>

        {/* Informações do sorteio */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-2 sm:p-3 min-w-[120px]">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-orange-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs text-gray-300 mb-1">Prêmio</p>
            <p className="text-xs sm:text-sm font-bold text-white text-center">Honda Biz 0km</p>
            <p className="text-[9px] text-gray-400 mt-1">Sorteio: 31/12</p>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-2 sm:p-3 min-w-[120px]">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs text-gray-300 mb-1">Prêmios Imediatos</p>
            <p className="text-xs sm:text-sm font-bold text-white text-center">30x PIX R$100</p>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-2 sm:p-3 min-w-[120px]">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs text-gray-300">Termina em</p>
            <p className="text-xs sm:text-sm font-bold text-yellow-400 text-center">1d 10h 30m</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RaffleHero;
