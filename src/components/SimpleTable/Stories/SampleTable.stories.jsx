import React from "react"
import TableContainer from '../TableContainer'
import {TableRow ,Table, TableHead, TableBody, TableCell, TableHeader} from '../index'
export default {
    title: "Components/Table",
    component: TableContainer,
    subComponents : {TableRow ,Table, TableHead, TableBody, TableCell, TableHeader},
    argTypes: {
     
    }

}
const TableExample = (args) => (
    <>
    <TableContainer {...args} >
        <Table>
      
        <TableRow>
            <TableHeader>S.No</TableHeader>
            <TableHeader>Company</TableHeader>
            <TableHeader>Contact</TableHeader>
            <TableHeader>Countrys</TableHeader>
        </TableRow>
       
         <TableBody >
                    {args.Data.map(eg=> 
                        <TableRow disabled ={true}>
                            <TableCell>{eg.Id}</TableCell>
                            <TableCell>{eg.Name}</TableCell>
                            <TableCell>{eg.Company}</TableCell>
                            <TableCell>{eg.Country}</TableCell>
                        </TableRow>)}
        </TableBody>
        </Table>
       
    </TableContainer> 
    </>
);


export const Default  = TableExample.bind({});
Default.args = {
    disabled : false,
    Data : [{Id : '1' , Name : "Essenca" , Country : "Germany", Company : 'Micheal hasche'},
    {Id : '2' , Name : "Centro comercial Moctezuma" , Country : "Germany", Company : 'Francisco Chang'},
    {Id : '3' , Name : "Ernst Handel" , Country : "Germany", Company : '	Roland Mendel'},
    {Id : '4' , Name : "Island Trading" , Country : "Germany", Company : 'Helen Bennett'},
    {Id : '5' , Name : "Alfreds Futterkiste" , Country : "Germany", Company : 'Maria Anders'}
],
isExpanded : false
};

