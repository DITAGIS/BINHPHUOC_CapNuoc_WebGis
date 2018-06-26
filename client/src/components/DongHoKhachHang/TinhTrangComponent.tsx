import * as React from 'react';
import { Tooltip, PieChart, Legend, Pie, Cell } from 'recharts';

const COLORS = ['#1abc9c', '#2ecc71', '#3498db',
  '#9b59b6', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
type States = {
};

type Props = {
  datas: any[]
};

class TinhTrangComponent extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { datas } = this.props;
    if (!datas) {
      return <div></div>;
    }
    return (
      <div>
        <h1 style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>Biểu đồ tình trạng khảo sát</h1>
        <h2 style={{ width: '100%', fontSize: 20, textAlign: 'center' }}>Đồng hồ khách hàng</h2>
        <p style={{ textAlign: 'center' }}>
          Tổng đồng hồ:
    <strong>
            {
              datas && datas.length > 1 ? datas.reduce((a, b) =>
                ({ value: a.value + b.value, name: '', key: 0 })).value + '' : '0'
            }
          </strong>
        </p>
        <PieChart width={390} height={350}>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} align="center" />
          {
            datas && datas.length > 0 &&
            < Pie data={datas}
              dataKey="value"
              nameKey="name"
              cx="50%" cy="50%"
              innerRadius={20}
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {
                datas.map((entry, index) =>
                  <Cell key={'cell' + entry.key} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
          }
        </PieChart>
      </div>
    );
  }
}
export default TinhTrangComponent;