import { useState, useEffect } from 'react';
import { Clock, Gift, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRaffle } from "@/contexts/RaffleContext";

const calculateTimeLeft = (endDate: string) => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

// Componente de banner principal do sorteio
const RaffleHero = () => {
  const { bannerUrl, cards, endDate } = useRaffle();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formattedTime = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;

  // Função para renderizar o ícone correto com base no nome
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-orange-primary mx-auto mb-0.5" />;
      case 'trending-up':
        return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-primary mx-auto mb-0.5" />;
      case 'clock':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-primary mx-auto mb-0.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 w-full py-6 sm:py-12 text-center">
        <div className="mb-4 sm:mb-8 w-full">
          <img 
            src={bannerUrl} 
            alt="Banner do Sorteio" 
            className="w-full h-auto rounded-xl shadow-lg" 
          />
        </div>

        {/* Informações do sorteio */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          {/* Card do Prêmio */}
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-1.5 sm:p-2 min-w-[90px]">
            {renderIcon(cards.premio.icone)}
            <p className="text-[9px] text-gray-300">{cards.premio.titulo}</p>
            <p className="text-[10px] sm:text-xs font-bold text-white text-center">{cards.premio.descricao}</p>
            <p className="text-[8px] text-gray-400 text-center">{cards.premio.rodape}</p>
          </Card>
          
          {/* Card do Desconto no Combo */}
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-1.5 sm:p-2 min-w-[90px]">
            {renderIcon(cards.desconto.icone)}
            <p className="text-[9px] text-gray-300">{cards.desconto.titulo}</p>
            <p className="text-[10px] sm:text-xs font-bold text-white text-center">{cards.desconto.descricao}</p>
            <p className="text-[8px] text-green-400 text-center">{cards.desconto.rodape}</p>
          </Card>
          
          {/* Card do Tempo Restante */}
          <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-1.5 sm:p-2 min-w-[90px]">
            {renderIcon(cards.tempo.icone)}
            <p className="text-[9px] text-gray-300">{cards.tempo.titulo}</p>
            <p className="text-[10px] sm:text-xs font-bold text-yellow-400 text-center">{timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? formattedTime : 'Sorteio Encerrado'}</p>
            <p className="text-[8px] text-gray-400 text-center">{cards.tempo.rodape}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RaffleHero;