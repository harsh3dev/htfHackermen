"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { WalletData } from "@/lib/data/mock-wallets";

interface WalletTableProps {
  wallets: WalletData[];
}

export function WalletTable({ wallets }: WalletTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-violet-800">
          {columns.map((column, index) => (
            <TableHead key={index} className="text-violet-400">
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {wallets.map((wallet) => (
          <TableRow
            key={wallet.address}
            className="border-violet-800/50 hover:bg-violet-900/20 transition-colors"
          >
            {columns.map((column, index) => (
              <TableCell key={index}>{column.cell(wallet)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}