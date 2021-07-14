import React, { Component } from 'react';
import {instance as api} from '../../axios';
import './Categories.css';
// after
import { connect } from "react-redux";
import SortableTree from 'react-sortable-tree';
import { getTreeFromFlatData, addNodeUnderParent, removeNodeAtPath } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import { notification, Button, Skeleton } from 'antd';

import NewCategoryModal from './New';
import DeleteCategoryModal  from './Delete';
import DeleteTemplateModal from './Delete/DeleteTemplate';
import Search from './Search';
import NewRootCategory from './New/RootCategory'; 
class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
          searchString: '',
          searchFocusIndex: 0,
          searchFoundCount: null,
          categories: [],
          newCategory: {
            ModalVisiblity: false,
            name: "",
            node: null,
            path: null
          },
          deleteCategory: {
            ModalVisiblity: false,
            node: null,
            path: null
          },
          deleteTemplate: {
            ModalVisiblity: false,
            node: null,
            path: null
          }
        };
        this.saveToBackend = this.saveToBackend.bind(this)
        this.newModalVisibility = this.newModalVisibility.bind(this)
        this.saveNewCategory = this.saveNewCategory.bind(this)
        
        this.deleteFromBackend = this.deleteFromBackend.bind(this)
        this.deleteModalVisibility = this.deleteModalVisibility.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
    }

    async componentDidMount () {
        const {data} = await api.get("/categories")
        let categories = data;
        for (var i = 0; i < categories.length; i++) {
          // To remove certain null values. This bug had been rectified in the backend.
          // Condition still kept as a double check
          if (categories[i] === null) {
            categories.splice(i, 1);
            i--;
            continue;
          }
          categories[i].title = categories[i].name
        }
        
        function getKey(node) {
          return node._id;
        }

        function getParentKey(node) {
          return node.parent_id
        }

        const tree = getTreeFromFlatData({flatData: categories, getKey, getParentKey, rootKey: null})
        categories = tree; //populate this from API.
        this.setState({ categories });
        this.props.setOptions({ options: categories })
    }

    async deleteFromBackend (id) {
      const resp = await api.delete('/categories/'+id)
      if (resp.status === 204) {
        notification['success']({
          message: 'Category Deleted',
          description:
            'The category has been deleted from the database!',
        });
      }
    }

    saveToBackend (newNode) {
      let newCategory = this.state.newCategory;
      this.setState({newCategory})
      return api.post("/categories", {...newNode, name: newNode.title})
        .then(resp => {
          if(resp.status === 201) {
            notification['success']({
              message: 'New Category Saved',
              description:
                'The new category has been added to the database!',
            });
            return resp.data;
          } else {
            return false;
          }
        }).catch(e => false)
    }

    newModalVisibility (bool, node, path) {
      let newCategory = this.state.newCategory
      newCategory.ModalVisiblity = bool
      // We need to save the node and path of the current node so that
      // the modal will send the data and we can have the parent_id to send to the backend. 
      if(node) {
        newCategory.node = node
      }
      if(path) {
        newCategory.path = path
      }
      this.setState({newCategory})
    }

    async saveNewCategory (name) {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      let newCategory = this.state.newCategory
      let {node, path} = newCategory, title = name

      if (!title) {
        return;
      }
      const newNode = {
        title,
        parent_id: node ? node._id : null,
        path: node ? node.path + '/' + title : title, 
      };
      
      const savedToBackend = await this.saveToBackend(newNode)
      if (!savedToBackend) {
        return notification['error']({
          message: 'An Error Occurred',
          description: 'The new category was not added to the database!',
        });
      }
      newNode._id = savedToBackend.id;
      if(node === null) {
        this.setState(state => ({
          categories: state.categories.concat(newNode),
        }))
      } else {
        this.setState((state) => ({
          categories: addNodeUnderParent({
            treeData: state.categories,
            parentKey: path[path.length - 1],
            expandParent: true,
            getNodeKey,
            newNode,
            addAsFirstChild: state.addAsFirstChild,
          }).treeData,
        }));
      }
      // After addition of the new node, the newCategory variable in state needs to be updated.
      newCategory.ModalVisiblity = false;
      newCategory.node = null;
      newCategory.path = null;
      this.setState({ newCategory })
    }

    deleteModalVisibility(bool, node, path) {
      let deleteCategory = this.state.deleteCategory
      deleteCategory.ModalVisiblity = bool
      if (node) {
        deleteCategory.node = node
      }
      if (path) {
        deleteCategory.path = path
      }
      this.setState({ deleteCategory })
    }

    deleteCategory (bool) {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      let {node, path} = this.state.deleteCategory
      this.setState(state => ({
        categories: removeNodeAtPath({
          treeData: state.categories,
          path,
          getNodeKey,
        }),
      }))
      this.deleteFromBackend(node._id)
    }

    deleteTemplate = async () => {
      const node = this.state.deleteTemplate.node
      const resp = await api.delete(`/templates/${node.template_id}`)
      if (resp.status === 204) {
        notification['success']({
          message: 'Template Deleted',
          description:
            'The template has been removed from the database!',
        });
        let categories = this.state.categories;
        categories.forEach(cat => {
          if (cat._id === node._id) {
            cat.template_id = null;
          }
        })
        this.setState({ categories })
      }
    }

    deleteTemplateModalVisibility = (bool, node, path) => {
      let deleteTemplate = this.state.deleteTemplate;
      deleteTemplate = {
        ModalVisiblity: bool,
        node, 
        path
      };
      this.setState({ deleteTemplate });
    }

    render() {
      const { searchString, searchFocusIndex, searchFoundCount } = this.state;
      
      const selectPrevMatch = () =>
        this.setState({
          searchFocusIndex:
            searchFocusIndex !== null
              ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
              : searchFoundCount - 1,
        });

      const selectNextMatch = () =>
        this.setState({
          searchFocusIndex:
            searchFocusIndex !== null
              ? (searchFocusIndex + 1) % searchFoundCount
              : 0,
        });

      const customSearchMethod = ({ node, searchQuery }) => {
        return (
        searchQuery &&
        node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1)
      }

      const searchInputChange = (event) => this.setState({ searchString: event.target.value });
      return (
        <div className="Categories">
          <h3>List of Categories</h3>
          <Search
            searchParams={{searchString, searchFocusIndex, searchFoundCount}}
            selectPrevMatch={selectPrevMatch}
            selectNextMatch={selectNextMatch}
            inputChange={searchInputChange}
          />
          <NewRootCategory 
            onClick={() => this.newModalVisibility(true, null, null)}
          />
          {this.state.categories.length ? (<SortableTree
            canDrag={false}
            treeData={this.state.categories}
            onChange={(treeData) => this.setState({ categories: treeData })}
            generateNodeProps={({ node, path }) => ({
              buttons: [
                <Button
                  onClick={async () => {
                    this.newModalVisibility(true, node, path)
                  }}
                >
                  Add Child
                </Button>,
                // If a category has children or a category has an existing template, it cannot be deleted. 
                (!node.children && node.template_id == null) ? (<Button
                  onClick={(event) => {
                    this.deleteModalVisibility(true, node, path)
                  }
                }>
                  Remove
                </Button>) : null,
                (!node.template_id) ? (<Button
                  href={`/template?category=${node._id}`}
                >
                  Add Template
                </Button>) : [(<Button
                  key={`edit-${node._id}`}
                  href={`/template?category=${node._id}&template=${node.template_id}`}
                >
                  View/Edit Template
                </Button>),
                ((node.products === 0 && node.template_id !== null) ? (<Button
                  key={`remove-${node._id}`}
                  onClick={async (event) => this.deleteTemplateModalVisibility(true, node, path)}
                >
                  Remove Template
                </Button>) : (<Button
                  key={`editprod-${node._id}`}
                  href={`/product?category=${node._id}`}
                >
                  View/Edit Product
                </Button>)),
                (<Button
                  key={`addprod-${node._id}`}
                  href={`/addproduct?category=${node._id}&template=${node.template_id}`}
                >
                  Add Product
                </Button>)],
              ],
            })}
            searchMethod={customSearchMethod}
            onlyExpandSearchedNodes
            // The query string used in the search. This is required for searching.
            searchQuery={searchString}
            // When matches are found, this property lets you highlight a specific
            // match and scroll to it. This is optional.
            searchFocusOffset={searchFocusIndex}
            // This callback returns the matches from the search,
            // including their `node`s, `treeIndex`es, and `path`s
            // Here I just use it to note how many matches were found.
            // This is optional, but without it, the only thing searches
            // do natively is outline the matching nodes.
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })
            }
          />) : <Skeleton active />}
          <NewCategoryModal
            visibility={this.state.newCategory.ModalVisiblity}
            setVisibility={this.newModalVisibility}
            saveNewCategory={this.saveNewCategory}
          />
          <DeleteCategoryModal
            visibility={this.state.deleteCategory.ModalVisiblity}
            setVisibility={this.deleteModalVisibility}
            deleteCategory={this.deleteCategory}
          />
          <DeleteTemplateModal
            visibility={this.state.deleteTemplate.ModalVisiblity}
            setVisibility={this.deleteTemplateModalVisibility}
            deleteTemplate={this.deleteTemplate}
          />
        </div>
      );
    }
}

export default connect(({ options }) => ({
  options
}), (dispatch) => ({
  setOptions: ({ options }) => 
    dispatch({
      type: 'SET_OPTIONS',
      payload: options
    })
}))(Categories);
