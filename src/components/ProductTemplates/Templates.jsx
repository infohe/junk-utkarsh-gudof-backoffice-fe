import React, { Component } from 'react';
import { connect } from "react-redux";
import './css';
import { Layout, Tabs, Card } from 'antd';
import Tree from './Tree';
import { FormView, SchemaView, UiSchemaView } from "./views";
import NodeEditor from './Editor';
import Toolbar from './Toolbar';
import Settings from './Settings';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

class NewTemplate extends Component {
    state = {
        collapsed: false,
        categoryId: null,
        templateId: null
    };
    componentWillMount() {
      this.props.setFormData({ formData: {} })
      this.props.defaultMenu();
    }
    componentDidMount () {
      // To remove the inline icons (Delete, etc) which are present in Template page
      this.props.updateSettings({ isInlineMode: true })
      const query = new URLSearchParams(this.props.location.search)
      let categoryId = query.get('category'), templateId = query.get('template')
      this.setState({categoryId, templateId})
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { settings } = this.props;
        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                    width={settings.leftSiderWidth}
                    style={{
                        background: '#fff',
                        padding: 0,
                        overflow: 'auto',
                        boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.2)',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <Tabs defaultActiveKey="0" size="small" type="card">
                        <TabPane tab="Editor" style={{ padding: '8px' }} key="0">
                            <Tree />
                        </TabPane>
                        <TabPane tab="Settings" style={{ padding: '8px' }} key="1">
                            <Settings />
                        </TabPane>
                    </Tabs>
                </Sider>
                <Layout style={{ marginLeft: settings.leftSiderWidth }}>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Toolbar category={this.state.categoryId} template={this.state.templateId}/>
                    </Header>
                    <Content style={{ minHeight: 280, padding: '12px 8px' }}>
                        <Card
                            bordered={false}
                            style={{ width: settings.formWidth, margin: '12px 8px', display: 'inline-block', verticalAlign: 'top' }}
                        >
                            <FormView />
                        </Card>
                        {(settings.subViews || []).map((a) => {
                            const style = { margin: '12px 8px', width: 400, display: 'inline-block', verticalAlign: 'top' };
                            switch (a) {
                              case "schema":
                                return (
                                  <Card
                                    key="schema"
                                    title="Schema"
                                    style={style}
                                  >
                                    <SchemaView />
                                  </Card>
                                );
                              case "uiSchema":
                                return (
                                  <Card
                                    key="uischema"
                                    title="UiSchema"
                                    style={style}
                                  >
                                    <UiSchemaView />
                                  </Card>
                                );
                              default:
                                return <div key="null" />;
                            }
                        })}
                    </Content>
                </Layout>
              <Sider
                width={this.props.activeNodeKey ? settings.rightSiderWidth : 0}
                style={{
                  overflow: 'auto',
                  background: '#fff',
                  boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.2)',
                  position: 'fixed',
                  height: '100vh',
                  right: 0,
                }}
              >
                <NodeEditor />
              </Sider>
            </Layout>
        );
    }
}

export default connect(({ activeNodeKey, settings }) => ({
  activeNodeKey,
  settings,
}), (dispatch) => ({
  setFormData: ({ formData }) =>
    dispatch({
      type: 'FORM_DATA_SET',
      payload: formData,
    }),
    updateSettings: (payload) =>
      dispatch({
        type: 'SETTINGS_UPDATE',
        payload,
      }),
    defaultMenu: () =>
      dispatch({
        type: 'MENU_DEFAULT',
        payload: {},
      }),
}))(NewTemplate);

// export default NewTemplate;