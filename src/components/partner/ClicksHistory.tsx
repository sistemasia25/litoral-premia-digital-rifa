import { useState, useEffect } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PartnerClick } from '@/types/partner';

interface ClicksHistoryProps {
  limit?: number;
}

export function ClicksHistory({ limit = 10 }: ClicksHistoryProps) {
  const { getClicksHistory, isLoading } = usePartner();
  const [clicks, setClicks] = useState<PartnerClick[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadClicks = async () => {
    try {
      setIsRefreshing(true);
      // A função getClicksHistory será implementada no hook usePartner
      const data = await getClicksHistory(limit);
      setClicks(data);
    } catch (error) {
      console.error('Erro ao carregar histórico de cliques:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadClicks();
  }, [limit]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getDeviceIcon = (userAgent: string) => {
    if (/mobile/i.test(userAgent)) {
      return '📱';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return '📱';
    } else if (/bot|crawler|spider/i.test(userAgent)) {
      return '🤖';
    }
    return '💻';
  };

  const getBrowserInfo = (userAgent: string) => {
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/edg/i.test(userAgent)) return 'Edge';
    if (/opera|opr/i.test(userAgent)) return 'Opera';
    if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
    return 'Navegador desconhecido';
  };

  const getOSInfo = (userAgent: string) => {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac os/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    return 'Sistema desconhecido';
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch (e) {
      return url || 'Origem direta';
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Histórico de Cliques</h3>
          <p className="text-sm text-gray-400">Acompanhe quem está clicando no seu link de afiliado</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadClicks}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="rounded-md border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Navegador</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clicks.length > 0 ? (
              clicks.map((click) => (
                <TableRow key={click.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{formatDate(click.date)}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(click.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-400" />
                      <a 
                        href={click.referrer || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                        title={click.referrer || 'Origem direta'}
                      >
                        {getDomainFromUrl(click.referrer || '')}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getDeviceIcon(click.userAgent)}</span>
                      <span>{getOSInfo(click.userAgent)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getBrowserInfo(click.userAgent)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={click.converted ? 'default' : 'outline'}>
                      {click.converted ? 'Convertido' : 'Não convertido'}
                    </Badge>
                    {click.converted && click.conversionDate && (
                      <div className="text-xs text-green-400 mt-1">
                        Convertido em {formatDate(click.conversionDate)}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum clique registrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && clicks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum clique registrado ainda.</p>
          <p className="text-sm">Compartilhe seu link de afiliado para começar a receber cliques!</p>
        </div>
      )}
    </div>
  );
}
