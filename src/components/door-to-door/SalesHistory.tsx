import { useState, useEffect } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { useAuth } from '@/contexts/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Search, Filter, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

type SaleStatus = 'all' | 'pending' | 'settled' | 'cancelled';

interface SalesHistoryProps {
  partnerId: string;
}

export function SalesHistory({ partnerId }: SalesHistoryProps) {
  const { getDoorToDoorSales } = usePartner();
  const { user } = useAuth();
  
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SaleStatus>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    settled: 0,
    cancelled: 0,
    totalAmount: 0,
  });

  const ITEMS_PER_PAGE = 10;

  const loadSales = async (page = 1, filters = {}) => {
    try {
      setIsLoading(true);
      const response = await getDoorToDoorSales(partnerId, {
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        date: dateFilter || undefined,
        ...filters,
      });
      
      setSales(response.data);
      setTotalPages(Math.ceil(response.pagination.total / ITEMS_PER_PAGE));
      setTotalSales(response.pagination.total);
      
      // Atualizar estatísticas
      if (page === 1) {
        setStats({
          total: response.pagination.total,
          pending: response.stats.pending || 0,
          settled: response.stats.settled || 0,
          cancelled: response.stats.cancelled || 0,
          totalAmount: response.stats.totalAmount || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de vendas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) {
      loadSales(1);
    }
  }, [partnerId, statusFilter, searchTerm, dateFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadSales(1, { search: searchTerm });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as SaleStatus);
    setCurrentPage(1);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      pending: { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      settled: { text: 'Acertado', className: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelado', className: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Histórico de Vendas</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={clearFilters}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm font-medium text-slate-400">Total de Vendas</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm font-medium text-slate-400">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm font-medium text-slate-400">Acertadas</p>
          <p className="text-2xl font-bold text-green-400">{stats.settled}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm font-medium text-slate-400">Canceladas</p>
          <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm font-medium text-slate-400">Valor Total</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats.totalAmount)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="settled">Acertadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                value={dateFilter}
                onChange={handleDateFilter}
                className="pl-9 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </form>
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center p-8 text-slate-400">
            <p>Nenhuma venda encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Números
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-750/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {format(new Date(sale.createdAt), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(sale.createdAt), { locale: ptBR, addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{sale.customerName}</div>
                      <div className="text-xs text-slate-400">{sale.customerWhatsApp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {sale.numbers.slice(0, 3).map((num: string) => (
                          <span key={num} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                            {num}
                          </span>
                        ))}
                        {sale.numbers.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400">
                            +{sale.numbers.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatCurrency(sale.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-orange-500 hover:text-orange-600 mr-3">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-slate-400">
            Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, totalSales)}
            </span>{' '}
            de <span className="font-medium">{totalSales}</span> resultados
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Anterior
            </Button>
            <div className="flex items-center px-3 text-sm text-slate-300">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
