import React from 'react';
import { connect } from 'react-redux';
import { Menu, Modal, Input, Select } from 'antd';
const { Option } = Select;
const { SubMenu, Item } = Menu;

function nameGen(name, occupied) {
  let n = 1;
  let newName = name;
  while (occupied && occupied.includes(newName)) {
    newName = name + '_' + n;
    n += 1;
  }
  return newName;
}

class AddItemMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: null,
      type: null,
      modalVisibility: false,
      item: null
    }
  }
  onAddNode = (node2add) => {
    const { addNode } = this.props;
    const name = nameGen(
      this.state.name ? this.state.name : node2add.name,
      this.props.node.children.map((a) => a.name)
    );
    // node2add.schema.items.type = this.state.type;
    // console.log(node2add);
    addNode({ ...node2add, name });
  };

  addFieldName = () => {
    this.onAddNode(this.state.item);
    this.setState({modalVisibility: false, item: null, name: null})
  };

  showModal = (b) => {
    this.setState({ modalVisibility: true, item: b });
  }

  render() {
    const {
      menu: { children: menuTree },
      menuOpenKeys,
      menuOpenChange,
    } = this.props;
    /* A modal can be added here that can ask for the title of the List element to be added. 
    Or a patch file will need to be replicated in the rjsf-patch for specific List element. */
    return (
      <Menu mode="inline" theme="dark" openKeys={menuOpenKeys} onOpenChange={menuOpenChange}>
        {menuTree.map((a) =>
          a.schema && a.schema.type === 'object' && a.children && a.children.length ? (
            <SubMenu key={a.key} title={a.schema.title || a.name}>
              {a.children.map((b) => (
                <Item key={b.key} onClick={() => {
                  if (b.name === "list" || b.name==="customlist") {
                    this.showModal(b);
                  } else {
                    this.onAddNode(b)
                  }
                }}>
                  {b.schema.title || b.name}
                </Item>
              ))}
            </SubMenu>
          ) : (
            <Item key={a.key} onClick={() => this.onAddNode(a)}>
              {a.schema.title || a.name}
            </Item>
          )
        )}
        <Modal
          title="List Field Name"
          content="Enter name of List Field"
          onOk={(this.addFieldName)}
          visible={this.state.modalVisibility}
          destroyOnClose
        >
          <p>List Name: </p>
          <Input placeholder="Enter name of list" onChange={(e) => this.setState({name: e.target.value})}/>
          <p>Element Type: </p>
          <Select
            placeholder="Select type of list"
            onChange={(val) => this.setState({type: val})}
          >
            <Option value="string">Text</Option>
            {/* <Option value="object">Object</Option> */}
            <Option value="number">Number</Option>
          </Select>
        </Modal>
      </Menu>
    );
  }
}

export default connect(
  ({ menu, menuOpenKeys }) => ({ menu, menuOpenKeys }),
  (dispatch, { node }) => ({
    addNode: (node2add) =>
      dispatch({
        type: 'TREE_ADD_NODE',
        payload: {
          targetNodeKey: node.key,
          position: 0,
          node2add,
        },
      }),
    menuOpenChange: (keys) =>
      dispatch({
        type: 'MENU_OPEN_KEYS_SET',
        payload: keys,
      }),
  })
)(AddItemMenu);
