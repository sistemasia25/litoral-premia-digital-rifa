
import { Clock, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const RaffleHero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/lovable-uploads/56e53f5a-394f-4d5c-add8-3c27c7e9ebc7.png" 
              alt="Litoral Premia" 
              className="w-full h-full animate-pulse"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            CONCORRA A UMA BIZ 0KM + PRÊMIOS NA HORA!
          </h1>
          <p className="text-xl text-yellow-400 mb-6 animate-fade-in">
            Sua chance de acelerar com uma Honda Biz novinha e ganhar prêmios instantâneos de até R$100!
          </p>
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

        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-orange-primary mb-2">
            💰 Números a partir de R$0,99 no combo!
          </p>
          <p className="text-sm text-gray-400">
            para o sorteio principal que irá 31 de Dezembro de 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default RaffleHero;
