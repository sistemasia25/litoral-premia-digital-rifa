
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-4">
            <Gift className="w-8 h-8 text-orange-primary mx-auto mb-2" />
            <p className="text-sm text-gray-300">Prêmio Principal</p>
            <p className="text-lg font-bold text-white">1 Honda Biz 0km (Sorteio 31/12/2024)</p>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-4">
            <TrendingUp className="w-8 h-8 text-orange-primary mx-auto mb-2" />
            <p className="text-sm text-gray-300">Prêmios Instantâneos</p>
            <p className="text-lg font-bold text-white">30 PIX de até 100 reais na hora</p>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-4">
            <Clock className="w-8 h-8 text-orange-primary mx-auto mb-2" />
            <p className="text-sm text-gray-300">Tempo Restante</p>
            <p className="text-lg font-bold text-yellow-400">1d 10h 30m</p>
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
