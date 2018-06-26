import * as React from 'react';
import {
  Table, TableHeader, TableRow,
  TableHeaderColumn, TableBody,
  TableRowColumn, LinearProgress
} from 'material-ui';

type States = {
};

type Props = {
  error?: string;
  isLoading: boolean;
  datas?: any[]
};

class TuyenDuongComponent extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { error, isLoading, datas } = this.props;
    return (
      <div>
        <h1 style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>Số đồng hồ theo tuyến đường</h1>
        {error &&
          <h4 style={{ color: 'red' }}>{error}</h4>
        }
        {isLoading && <LinearProgress />}
          <Table
            height="450px"
            selectable={true}
            multiSelectable={false}
            allRowsSelected={false}
          >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{ width: 40 }}>Mã ĐP</TableHeaderColumn>
                <TableHeaderColumn>Tên ĐP</TableHeaderColumn>
                <TableHeaderColumn style={{ width: 40 }}>Số lượng</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                datas
                && datas.map(
                  m =>
                    <TableRow key={'row' + m.MaDP}>
                      <TableRowColumn style={{ width: 40 }}>{m.MaDP}</TableRowColumn>
                      <TableRowColumn>{m.TenDP}</TableRowColumn>
                      <TableRowColumn style={{ width: 40 }}>{m.SoLuong}</TableRowColumn>
                    </TableRow>
                )
              }

            </TableBody>
          </Table>
      </div>
    );
  }
}
export default TuyenDuongComponent;