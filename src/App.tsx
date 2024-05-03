import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useTable, Column } from 'react-table';
import './App.css';

interface EquityData {
  correctedQuota: number;
  portfolioProductId: number;
  productName: string;
  value: number;
}

const Table: React.FC<{ columns: Column<EquityData>[]; data: EquityData[] }> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                className="table-header"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="table-row">
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    className="table-cell"
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TablePage: React.FC = () => {
  const [data, setData] = useState<EquityData[]>([]);
  const [filteredData, setFilteredData] = useState<EquityData[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const columns: Column<EquityData>[] = [
    { Header: 'Id', accessor: 'portfolioProductId' },
    { Header: 'Nome do Produto', accessor: 'productName' },
    { Header: 'Cota Corrigida', accessor: 'correctedQuota' },
    { Header: 'Valor', accessor: 'value' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<{ data: { dailyEquityByPortfolioChartData: EquityData[] } }> = await axios.get('https://6270328d6a36d4d62c16327c.mockapi.io/getFixedIncomeClassData');
        const fetchedData = response.data.data.dailyEquityByPortfolioChartData;
        setData(fetchedData);
        setFilteredData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleIdFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const filtered = data.filter(item => item.portfolioProductId.toString().toLowerCase().includes(value));
    setFilteredData(filtered);
  };

  const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const filtered = data.filter(item => item.productName.toLowerCase().includes(value));
    setFilteredData(filtered);
  };

  const handleSortToggle = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container">
      <div className="filter-section">
        <input type="text" placeholder="Id do Produto" onChange={handleIdFilterChange} className="filter-input" />
        <input type="text" placeholder="Nome do Produto" onChange={handleNameFilterChange} className="filter-input" />
        <button onClick={handleSortToggle} className={`sort-button ${sortOrder === 'desc' ? 'desc' : ''}`}>
          <span className="sort-icon"></span>
        </button>
      </div>
      <Table columns={columns} data={filteredData} />
    </div>
  );
};

export default TablePage;
