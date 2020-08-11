import React, { Component } from 'react';
import { Table, Button, notification, Spin, Space, Modal } from 'antd';
import { connect } from 'react-redux';
import { instance as api } from '../../../axios';
import './ProductList.css';

class ProductList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            templateId: null,
            categoryId: null,
            dataFetching: true,
            products: [],
            columns: []
        }
    }

    async componentDidMount () {
    try {
        const query = new URLSearchParams(this.props.location.search)
        let categoryId = query.get('category');
        let products = []
        if (categoryId !== null){
            this.setState({categoryId})
            let { data } = await api.get("/product/category/"+categoryId)
            products = data
            if(products.length !== 0)
                this.setState({templateId: products[0].template})
        } else {
            let { data } = await api.get("/product/")
            products = data
        }
        // For earlier products that didn't have any data
        products = products.filter(prod => prod.data !== "{}")

        const tableProducts = products.map(product => {
            if(product.name === undefined) {
                // For earlier products that didn't have manuf, model defined.
                product.name = '--Not defined--'
            }
            let updates = product.meta.update;
            return {
                name: product.name, 
                data: JSON.parse(product.data), 
                created_at: product.meta.created_at,
                updated_at: updates.length > 0 ? updates.slice(updates.length-1)[0].updated_at : '-',
                template: product.template,
                category: product.category,
                id: product._id,
                key: product._id
            };
        })
        const columns = [
            {
                title: 'Name', 
                dataIndex: 'name', 
                key: 'name',
                filters: tableProducts.map(prod => ({text: prod.name, value: prod.name}))
            }, {
                title: 'Created At',
                dataIndex: 'created_at',
                key: 'created_at',
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            }, {
                title: 'Update At',
                dataIndex: 'updated_at',
                key: 'updated_at',
                sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
            }
        ]
        columns.push({
            title: 'Add a product using existing product',
            key: 'name',
            width: 200,
            render: (item) => {
                return (<Button onClick={async (e) => {
                    let a = await this.props.setFormData({ formData: item.data });
                    // Due to asynchronous behaviour, the above line does not work without the setTimeout 
                    if (typeof a === 'object') {
                        setTimeout(() => {
                            let path = `addproduct?category=${item.category._id}&template=${item.template._id}`;
                            window.location.href = path;
                        }, 1000)
                    }
                }}>Make a Copy</Button>)
            },
        }, {
            title: 'Make changes to existing product',
            key: 'name',
            width: 200,
            render: (item) => {
                return (<Button
                    onClick={async (e) => {
                    let a = await this.props.setFormData({ formData: item.data })
                    // Due to asynchronous behaviour, the above line does not work without the setTimeout
                    if (typeof a === 'object') {
                        setTimeout(() => {
                            let path = `addproduct?category=${item.category._id}&template=${item.template._id}&product=${item.id}`
                            window.location.href = path;
                        }, 1000)
                    }
                }}>Edit</Button>)
            },
        }, {
            title: 'Delete Product',
            key: 'name',
            fixed: 'right',
            width: 100,
            render: (item) => {
                return (<Button onClick={(e) => {
                    Modal.confirm({
                        title: 'Confirm Deletion',
                        content: 'Are you sure you want to delete this product?',
                        onOk: async () => {
                            const resp = await api.delete(`/product/${item.category._id}/${item.id}`)
                            this.setState({dataFetching: true})
                            if (resp.status === 204) {
                                const products = this.state.products;
                                let indexOf = products.findIndex(el => el.id === item.id);
                                if (indexOf === -1) return ; // This condition would never should arise since the item to be deleted
                                // will always be there in the array
                                products.splice(indexOf, 1);
                                this.setState({products, dataFetching: false});
                                notification['success']({
                                    message: 'Product Deleted',
                                    description: 'This product was deleted from the database.'
                                })
                            } else {
                                notification['error']({
                                    message: 'An Error Occurred',
                                    description: 'There was an error while deleting this product.'
                                })
                            }
                        }
                    })
                }}>Remove Product</Button>
                )
            }
        })
        console.log(tableProducts);
        this.setState({products: tableProducts, columns, dataFetching: false})
    } catch (e) {
        console.log(e);
        notification['error']({
            message: 'An Error Occurred',
            description: 'There was an error while displaying products.'
        })
    }
    }

    render() {
        return (
        <div className="container main-container">
            <h3>{this.state.templateId ? 'Listing Products based on Template' : 'Listing all Products'}</h3>
        <div style={{ display: 'flex' }}>
                    {!this.state.dataFetching ? <Table dataSource={this.state.products} columns={this.state.columns} /> : <Space size="middle"><Spin /></Space>}
        </div>
        {this.state.categoryId && this.state.templateId ? (
            <Button
                style={{marginLeft: '45%'}}
                href={`/addproduct?template=${this.state.templateId}&category=${this.state.categoryId}`}
            >
            Add Product
            </Button>
        ): null}
        </div>
        )
    }
}

export default connect(({
    formData
}) => ({
    formData
}), (dispatch) => ({
    setFormData: ({ formData }) =>
        dispatch({
            type: 'FORM_DATA_SET',
            payload: formData,
        }),
}))(ProductList);