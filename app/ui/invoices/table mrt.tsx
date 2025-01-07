'use client'

// import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
// import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useMemo } from 'react';
import { InvoicesTable } from "@/app/lib/definitions"

export function InvoicesTableMRT({
  query,
  currentPage,
  invoices,
}: {
  query: string;
  currentPage: number;
  invoices: InvoicesTable[];
}) {

  // const data: InvoicesTable[] = [
  //   {
  //     id: '222',
  //     customer_id: '1213-1232-12',
  //     name: 'John Doe',
  //     email: 'test@test.com',
  //     image_url: '',
  //     amount: 101121,
  //     date: '01.01.2025',
  //     status: 'paid',
  //   },
  //   {
  //     id: '333',
  //     customer_id: '1213-1232-12',
  //     name: 'John Doe',
  //     email: 'test@test.com',
  //     image_url: '',
  //     amount: 101121,
  //     date: '01.01.2025',
  //     status: 'paid',
  //   },
  // ]

  const columns = useMemo<MRT_ColumnDef<InvoicesTable>[]>(
    () => [
      {
        accessorKey: 'customer_id',
        header: 'Customer',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        Cell: ({ cell }) =>  cell.getValue<Date>().toLocaleDateString(),
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: invoices,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
  })

  return <MaterialReactTable table={table} />
}
