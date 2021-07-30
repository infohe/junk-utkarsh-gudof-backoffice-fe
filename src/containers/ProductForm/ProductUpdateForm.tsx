import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Scrollbars } from 'react-custom-scrollbars';
import Form from "@rjsf/core";
import { useMutation, gql, useQuery } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Button, { KIND } from 'components/Button/Button';
import { Row, Col } from 'components/FlexBox/FlexBox';

import {
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';


type Props = any;

const UPDATE_PRODUCTS = gql`
  mutation updateProduct($product: UpdateProductInput!) {
    updateProduct(updateProductInput: $product) {
      _id,
      name,
      published,
      data,
      category{
        _id,
        name
      },
      template{
        _id,
        name,
        formSchema,
        uiSchema
      }
      deleted
    }
  }
`

const GET_PRODUCTS = gql`
query{
  allProducts{
     _id,
    name,
    published,
    data,
    category{
      _id,
      name
    },
    template{
      _id,
      name,
      formSchema,
      uiSchema
    }
    deleted
  }
}
`;

const AddProduct: React.FC<Props> = () => {
  const dispatch = useDrawerDispatch();
  const productDetails = useDrawerState('data');
  const { data, template, _id } = productDetails
  const [formData, setFormData] = useState(JSON.parse(data))
  const formSchema = JSON.parse(template.formSchema)
  const uiSchema = JSON.parse(template.uiSchema)

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: data,
  });
  const [updateProduct] = useMutation(UPDATE_PRODUCTS);

  const onSubmit = (data) => {
    updateProduct({ variables: { product: { _id, data: JSON.stringify(formData) } }, refetchQueries: [{ query: GET_PRODUCTS }] })
    console.log(data, 'newProduct data');
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Update Product</DrawerTitle>
      </DrawerTitleWrapper>

      <Scrollbars
        autoHide
        renderView={(props) => (
          <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
        )}
        renderTrackHorizontal={(props) => (
          <div
            {...props}
            style={{ display: 'none' }}
            className="track-horizontal"
          />
        )}
      >
        <Row>
          <Col lg={8}>
            <Form
              schema={formSchema}
              uiSchema={uiSchema}
              formData={formData}
              onChange={(newFormData) => { setFormData(newFormData.formData) }}
            >
            </Form>
          </Col>
        </Row>
      </Scrollbars>

      <ButtonGroup>
        <Button
          kind={KIND.minimal}
          onClick={closeDrawer}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: '50%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                borderBottomRightRadius: '3px',
                borderBottomLeftRadius: '3px',
                marginRight: '15px',
                color: $theme.colors.red400,
              }),
            },
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          onClick={onSubmit}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: '50%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                borderBottomRightRadius: '3px',
                borderBottomLeftRadius: '3px',
              }),
            },
          }}
        >
          Update Product
        </Button>
      </ButtonGroup>
    </>
  );
};

export default AddProduct;
