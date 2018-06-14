import * as React from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';
import { LayerFieldInfo } from '../Popup';
interface Props {
  layerFieldsInfos: LayerFieldInfo[];
  layer: __esri.FeatureLayer;
  attributes: object;
}

interface States {
  attributes: object | null;
}

const Item = (props: {
  layerField: LayerFieldInfo,
  value: string | number,
  onChange: (name: string, value: any) => void
}) => {
  const { layerField, value, onChange } = props;

  // nếu có domain thì hiển thị select
  if (layerField.domain && layerField.domain.type === 'coded-value') {
    let domain = layerField.domain as __esri.CodedValueDomain,
      codedValues = domain.codedValues;

    return (
      <div>
        <SelectField
          floatingLabelText={layerField.alias || layerField.name}
          value={value}
          fullWidth={true}
          onChange={
            (e: any, index: number, _value: string) => {
              onChange(layerField.name, _value);
            }}
        >
          {
            codedValues.map(m => <MenuItem key={domain.name + '_' + m.code} value={m.code} primaryText={m.name} />)
          }
        </SelectField>
      </div >
    );
  } else {
    switch (layerField.type) {
      case 'string':
      case 'small-integer':
      case 'integer':
      case 'double':
        return (
          <div>
            <TextField
              type={layerField.type === 'string' ? 'text' : 'number'}
              floatingLabelText={layerField.alias || layerField.name}
              value={value}
              fullWidth={true}
              onChange={(e: any) => { onChange(layerField.name, e.target.value); }}
            />
          </div>);
      default:
        return <div></div>;
    }
  }

};

class EditingComponent extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = { attributes: null };
  }
  componentDidMount() {
    this.setState({ attributes: this.props.attributes });
  }

  private onChange(name: string, value: any) {
    let attributes = { ...this.state.attributes };
    attributes[name] = value;
    this.setState({ attributes });
  }

  render() {
    const { layerFieldsInfos, layer } = this.props;
    const { attributes } = this.state;

    return (
      attributes &&
      <MuiThemeProvider>
        <div>
          {
            layerFieldsInfos.map(layerField => {
              return (
                <Item
                  key={layer.id + '_' + layerField.name}
                  layerField={layerField}
                  value={attributes[layerField.name] || ''}
                  onChange={this.onChange.bind(this)}
                />
              );
            })
          }
        </div>
      </MuiThemeProvider>

    );
  }

}

export default EditingComponent;