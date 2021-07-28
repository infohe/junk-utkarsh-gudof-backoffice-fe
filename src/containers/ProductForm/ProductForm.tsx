import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Scrollbars } from 'react-custom-scrollbars';
import Form from "@rjsf/core";
import { useDrawerDispatch } from 'context/DrawerContext';
import Button, { KIND } from 'components/Button/Button';
import { Row, Col } from 'components/FlexBox/FlexBox';
import Select from 'components/Select/Select';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';

import {
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { removeFragmentSpreadFromDocument } from '@apollo/client/utilities';

const GET_TEMPLATE_NAMES = gql`
  query{
    allTemplate{
      name,
      formSchema,
      uiSchema,
      category_id
      _id
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
const CREATE_PRODUCT = gql`
  mutation createProduct($product: CreateProductInput!) {
    createProduct(createProductInput: $product) {
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
type Props = any;

const AddProduct: React.FC<Props> = (props) => {
  const { data, error, refetch } = useQuery(GET_TEMPLATE_NAMES)
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, setValue } = useForm();
  const [type, setType] = useState([]);
  const [typeOptions, setTypeOptions] = useState([])
  const [formSchema, setFormSchema] = useState({})
  const [uischema, setUischema] = useState({})
  const [formData, setFormData] = useState({})

  React.useEffect(() => {
    if (data) {
      setTypeOptions([...data.allTemplate])
    }
  }, [data, register, type]);
  const [createProduct] = useMutation(CREATE_PRODUCT,{
    update(cache, { data: { createProduct } }) {
      const { allProducts } = cache.readQuery({
        query: GET_PRODUCTS,
      });
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: { allProducts: allProducts.concat([createProduct]) },
      })
    },
  });
  const handleTypeChange = ({ value }) => {
    setValue('type', value);
    setType(value);
    const formDetails = value[0] ? value[0].formSchema : '{}'
    const uiDetails = value[0] ? value[0].formSchema : '{}'
    setFormSchema(JSON.parse(formDetails))
    setUischema(JSON.parse(uiDetails))

  };

  const onSubmit = () => {
    const newProduct = {
      name:formData['name'],
      category:type[0].category_id,
      data:JSON.stringify(formData),
      mainCategory:type[0].category_id,
      published:true,
      template:type[0]._id
    };
    console.log(newProduct)
    createProduct({
      variables: { product: newProduct },
    });
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Product</DrawerTitle>
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
          <Col lg={4}>
            <FieldDetails>Select your category</FieldDetails>
          </Col>
          <Col lg={8}>
            <FormFields>
              <FormLabel>Template</FormLabel>
              <Select
                options={typeOptions}
                labelKey="name"
                valueKey="value"
                placeholder="Template Type"
                value={type}
                searchable={false}
                onChange={handleTypeChange}
                overrides={{
                  Placeholder: {
                    style: ({ $theme }) => {
                      return {
                        ...$theme.typography.fontBold14,
                        color: $theme.colors.textNormal,
                      };
                    },
                  },
                  DropdownListItem: {
                    style: ({ $theme }) => {
                      return {
                        ...$theme.typography.fontBold14,
                        color: $theme.colors.textNormal,
                      };
                    },
                  },
                  OptionContent: {
                    style: ({ $theme, $selected }) => {
                      return {
                        ...$theme.typography.fontBold14,
                        color: $selected
                          ? $theme.colors.textDark
                          : $theme.colors.textNormal,
                      };
                    },
                  },
                  SingleValue: {
                    style: ({ $theme }) => {
                      return {
                        ...$theme.typography.fontBold14,
                        color: $theme.colors.textNormal,
                      };
                    },
                  },
                  Popover: {
                    props: {
                      overrides: {
                        Body: {
                          style: { zIndex: 5 },
                        },
                      },
                    },
                  },
                }}
              />
            </FormFields>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <FieldDetails>
              Add your Product description and necessary information from here
            </FieldDetails>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <Form
              schema={formSchema}
              uiSchema={uischema}
              formData={formData}
              onChange={(newFormData)=>{setFormData(newFormData.formData)}}
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
          Create Product
        </Button>
      </ButtonGroup>
    </>
  );
};

export default AddProduct;
