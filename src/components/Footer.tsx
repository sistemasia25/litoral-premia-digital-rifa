
import { Card } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-card/80 backdrop-blur border-orange-primary/20 p-3 sm:p-4 mb-6 max-w-md mx-auto">
          <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 text-center">Realização & Apoio</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-orange-primary font-medium">Litoral da Sorte Eventos</p>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700"></div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-orange-primary font-medium">Parcerias Locais</p>
            </div>
          </div>
        </Card>

        <div className="text-center text-gray-400 text-xs space-y-3 max-w-3xl mx-auto">
          <p>
            Sorteio promovido por LITORAL DA SORTE PROMOÇÕES E EVENTOS LTDA, CNPJ: 47.305.890/0001-69.
          </p>
          <p>
            Ao adquirir um bilhete digital, o participante concorrerá a todos os sorteios previstos, mesmo que já tenha sido contemplado anteriormente. O prêmio poderá ser escolhido pelo ganhador entre a opção em produto físico ou valor equivalente em dinheiro, em moeda corrente nacional, conforme especificado no momento da contemplação.
          </p>
          <p>
            É proibida a participação de menores de 18 (dezoito) anos, conforme legislação vigente (Art. 3º do Código Civil).
          </p>
          <p>
            Imagens meramente ilustrativas.
          </p>
          <p>
            Ao participar, o titular do bilhete autoriza, desde já e sem qualquer ônus, a utilização de seu nome, imagem e voz para fins de divulgação da campanha em qualquer meio de comunicação.
          </p>
          <p className="text-orange-primary pt-2">
            Dúvidas? <span className="text-white">consulta@litoraldasorte.com.br</span>
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <a 
              href="/admin"
              className="text-xs text-gray-400 hover:text-orange-primary transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Área do Admin
            </a>
            <span className="hidden sm:inline text-gray-600">•</span>
            <a 
              href="/parceiro"
              className="text-xs text-gray-400 hover:text-orange-primary transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Área do Parceiro
            </a>
          </div>
          <p className="text-gray-500 text-center">v1.6.2</p>
          <p className="text-gray-500 text-center mt-1">© 2024 Litoral da Sorte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
