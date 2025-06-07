
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
          <Flame className="w-16 h-16 text-orange-primary mx-auto mb-4 animate-pulse" />
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

const Flame = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C12 2 8 6 8 11C8 14.31 10.69 17 14 17C17.31 17 20 14.31 20 11C20 6 16 2 16 2C16 2 14 4 12 4C10 4 8 2 8 2C8 2 10 4 12 4C14 4 16 2 16 2S18 5 18 9C18 11.21 16.21 13 14 13C11.79 13 10 11.21 10 9C10 6 12 2 12 2Z"/>
  </svg>
);

export default RaffleHero;
