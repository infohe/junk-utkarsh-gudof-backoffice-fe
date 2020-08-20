import React from 'react';
import { connect } from 'react-redux';
import { Menu, Modal, Input, Select } from 'antd';
const { Option } = Select;
const { SubMenu, Item } = Menu;

function nameGen(name, occupied) {
  let n = 1;
  let newName = name;
  while (occupied && occupied.includes(newName)) {
    newName = name + '#' + n;
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
      customList: false,
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
    if(this.state.type) {
      node2add.schema.items.type = this.state.type;
      this.setState({type: null, name: null, customList: false})
    }
    addNode({ ...node2add, name });
  };

  addFieldName = () => {
    this.onAddNode(this.state.item);
    this.setState({modalVisibility: false, item: null, name: null})
  };

  showModal = (b, listType) => {
    if(listType === 'customlist') {
      this.setState({ customList: true, item: b })
      this.onAddNode(b);
    } else {
      this.setState({ customList: false })
      this.setState({ modalVisibility: true, item: b });
    }
  }

  cancelModal = () => {
    this.setState({ modalVisibility: false, item: null });
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
                    this.showModal(b, b.name);
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
          onCancel={this.cancelModal}
          visible={this.state.modalVisibility}
          destroyOnClose
        >
          {/* <p>List Name: </p> */}
          {/* <Input placeholder="Enter name of list" onChange={(e) => this.setState({name: e.target.value})}/> */}
          {this.state.customList ? null : (<><p>Element Type: </p>
          <Select
            placeholder="Select type of list"
            onChange={(val) => this.setState({type: val})}
          >
            <Option value="string">Text</Option>
            {/* <Option value="">Dropdown</Option> */}
            {/* <Option value="object">Object</Option> */}
            <Option value="number">Number</Option>
          </Select></>)}
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
