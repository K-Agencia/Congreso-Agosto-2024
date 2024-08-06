import { Button, Table, TextInput } from 'flowbite-react';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdKeyboardArrowRight,
  MdSearch
} from "react-icons/md";

import { useState } from 'react';

const TableRegister = ({ columns, data }) => {

  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltering,
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    state: {
      globalFilter: filtering
    }
  })

  const headerList = table.getHeaderGroups()[0].headers;

  return (
    <div className='Register my-5'>

      <div className='mb-4 mx-4 grid grid-cols-6 gap-4'>
        <TextInput
          type='text'
          value={filtering}
          placeholder='Buscar'
          icon={MdSearch}
          className='col-span-5'
          onChange={(e) => setFiltering(e.target.value)}
        />
      </div>

      <div className='mx-4'>
        <Table striped className='border-collapse table-fixed'>
          <Table.Head>
            {headerList.map((header) => (
              <Table.HeadCell key={header.id} className={`border text-center`} style={{ width: `${header.getSize()}px` }}>{header.column.columnDef.header}</Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body>
            {table.getRowModel().rows.map(row => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Table.Cell key={cell.id} className='border p-1 text-lg' align={cell.column.columnDef.meta?.align}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                )
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className='w-full my-4 flex justify-center'>
        <Button.Group>
          <Button color="gray" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <MdOutlineKeyboardDoubleArrowLeft className="my-auto mr-3 h-4 w-4" />
            Primera pág.
          </Button>
          <Button color="gray" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <MdKeyboardArrowLeft className="my-auto mr-3 h-4 w-4" />
            Pág. anterior
          </Button>
          <Button color="gray" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <MdKeyboardArrowRight className="my-auto mr-3 h-4 w-4" />
            Pág. Siguiente
          </Button>
          <Button color="gray" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <MdOutlineKeyboardDoubleArrowRight className="my-auto mr-3 h-4 w-4" />
            Ultima pág.
          </Button>
        </Button.Group>
      </div>
    </div>
  );
};

export default TableRegister;
{/* <Table.Cell>
                {reclamo === 1 &&
                  
                }
                {reclamo === 0 &&
                  
                }
              </Table.Cell> */}