
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function AdminParceiros() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Gerenciar Parceiros</h2>
        <p className="text-gray-400">Gerencie parceiros cadastrados e pedidos porta a porta</p>
      </div>

      <Tabs defaultValue="partners" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="partners" className="text-white data-[state=active]:bg-orange-600">
            Parceiros Cadastrados
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-white data-[state=active]:bg-orange-600">
            Pedidos Porta a Porta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Lista de Parceiros</CardTitle>
              <CardDescription className="text-gray-400">
                Visualize e gerencie todos os parceiros cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, cidade ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Parceiro</TableHead>
                    <TableHead className="text-gray-300">Contato</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-400">
                      Nenhum parceiro cadastrado
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Pedidos Porta a Porta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                Nenhum pedido porta a porta encontrado
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
