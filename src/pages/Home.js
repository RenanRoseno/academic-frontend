import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from '@mui/material/Button';

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function Home() {
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  
  let selectedParam = null

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    if(selectedRowsData){
      selectedParam = selectedRowsData[0];
    } else {
      selectedParam = null;
    }
    
    console.log(selectedRowsData);
  };
  
  const teste = (params) => {
    console.log(selectedParam);
    return selectedParam ? params.row.id == selectedParam.id : true;
    
  }
  
  return (
    <div className="container">
      <Box sx={{ height: 400, width: "100%" }}>
      <Button
        sx={{ mb: 2 }}
        onClick={() => setCheckboxSelection(!checkboxSelection)}
      >
        Toggle checkbox selection
      </Button>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={checkboxSelection}
          experimentalFeatures={{ newEditingApi: true }}
          onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
          isRowSelectable={(params) => teste(params)}
        />
      </Box>
    </div>
  );
}
