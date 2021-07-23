import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, gql } from '@apollo/client';
import { useDrawerDispatch } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import Uploader from 'components/Uploader/Uploader';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import {useTemplateState} from './TemplateContext'

const GET_CATEGORIES = gql`
  query getCategories($type: String, $searchBy: String) {
    categories(type: $type, searchBy: $searchBy) {
      id
      icon
      name
      slug
      type
    }
  }
`;
const CREATE_CATEGORY = gql`
  mutation createCategory($category: AddCategoryInput!) {
    createCategory(category: $category) {
      id
      name
      type
      icon
      # creation_date
      slug
      # number_of_product
    }
  }
`;

const options = [
  { value: 'grocery', name: 'Grocery', id: '1' },
  { value: 'women-cloths', name: 'Women Cloths', id: '2' },
  { value: 'bags', name: 'Bags', id: '3' },
  { value: 'makeup', name: 'Makeup', id: '4' },
];
type Props = any;

const AddCategory: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const formSchema=JSON.parse(useTemplateState('formSchema'))
  console.log(formSchema)
  const { register, handleSubmit, setValue } = useForm();
  const [schema, setSchema] = React.useState(formSchema);
  const [uischema, setUiSchema] = React.useState('{}');
  const [category, setCategory] = useState([]);
  React.useEffect(() => {
    register({ name: 'parent' });
    register({ name: 'image' });
  }, [register]);
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    update(cache, { data: { createCategory } }) {
      const { categories } = cache.readQuery({
        query: GET_CATEGORIES,
      });

      cache.writeQuery({
        query: GET_CATEGORIES,
        data: { categories: categories.concat([createCategory]) },
      });
    },
  });

  const onSubmit = ({ name, slug, parent, image }) => {
    const newCategory = {
      id: uuidv4(),
      name: name,
      type: parent[0].value,
      slug: slug,
      icon: image,
      creation_date: new Date(),
    };
    createCategory({
      variables: { category: newCategory },
    });
    closeDrawer();
    console.log(newCategory, 'newCategory');
  };
  const handleChange = ({ value }) => {
    setValue('parent', value);
    setCategory(value);
  };
  const handleUploader = (files) => {
    setValue('image', files[0].path);
  };
 
  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Edit Template</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
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
            <Col xs={12}>
              <DrawerBox>
                <FormBuilder
                  schema={schema}
                  uischema={uischema}
                  onChange={(newSchema: string, newUiSchema: string) => {
                    setSchema(newSchema);
                    setUiSchema(newUiSchema)
                  }}
                />
              </DrawerBox>
            </Col>
          </Row>
         

        </Scrollbars>
      </Form>
    </>
  );
};

export default AddCategory;
