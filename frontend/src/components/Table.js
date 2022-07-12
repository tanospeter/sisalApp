import './Table.css'

const Table = ({column, data}) => {
  return (
    <table>
      <thead>
        <tr>          
          {column.map((item, index) => <TableHeadItem item = {item}/>)}          
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => <TableRow item = {item} />)}
      </tbody>
    </table>
    
    )
}

const TableHeadItem = ({item}) => <th>{item}</th>

const TableRow = ({item}) => (
  <tr>
    {}
  </tr>
)


{
  console.log(item)
}//<tr><tr/>

export default Table