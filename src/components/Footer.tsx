
import { Card } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-card border-orange-primary/20 p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Realização & Apoio</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-orange-primary font-bold">Litoral da Sorte Eventos</p>
            </div>
            <div>
              <p className="text-orange-primary font-bold">Parcerias Locais</p>
            </div>
          </div>
        </Card>

        <div className="text-center text-gray-400 text-sm space-y-2">
          <p>
            Sorteio promovido por LITORAL DA SORTE PROMOÇÕES E EVENTOS LTDA, CNPJ: 47.305.890/0001-69. Válido nos bons território catarinense.
          </p>
          <p>
            Sorteio sujeito aos critérios baseados na loteria federal e normas da Caixa do Governo e são realizados de 10 Governo pelo. Os prêmios das pessoas e características, e não
            são distribuídos em espécie, exceto quando legalmente indicados.
          </p>
          <p>
            Confira os termos gerais e específicos.
          </p>
          <p className="text-orange-primary">
            Consulta Geral - Regulamento <span className="text-white">consulta@litoraldasorte.com.br</span>
          </p>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500">v1.6.2</p>
          <p className="text-gray-500 mt-2">© 2024 Litoral da Sorte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
