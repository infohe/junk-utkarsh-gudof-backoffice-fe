import React, { useState, useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useDrawerDispatch } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { useTemplateState } from './TemplateContext'

const UPDATE_FORMSCHEMA = gql`
  mutation updateTemplate($template: UpdateTemplateInput!) {
    updateTemplate(updateTemplateInput: $template) {
      _id,
      name,
      category_id,
      formSchema
      uiSchema
    }
  }
`
const GET_TEMPLATE = gql`
    query   {
        allTemplate{
            _id,
            name,
            category_id,
            formSchema
            uiSchema
        }
    }
`;

type Props = any;

const AddCategory: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const formSchema = useTemplateState('formSchema')
  const templateId = useTemplateState('_id')
  const uiSchema= useTemplateState('uiSchema')
  const [schema, setSchema] = useState(formSchema);
  const [uischema, setUiSchema] = useState(uiSchema);
  const [updateTemplate] = useMutation(UPDATE_FORMSCHEMA,{
    onCompleted(data){
    },
    onError(error){
      console.log(error)
    }
  })
  const onSubmit = () => {
    updateTemplate({
      variables: { template: { _id:templateId, formSchema:schema,uiSchema:uischema } },
      refetchQueries: [{ query: GET_TEMPLATE }]
    })
    closeDrawer()
  };


  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Edit Template</DrawerTitle>
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
      <ButtonGroup >
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
          onClick={onSubmit}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: '25%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                borderBottomRightRadius: '3px',
                borderBottomLeftRadius: '3px',
              }),
            },
          }}
        >
          update template
        </Button>
      </ButtonGroup>
    </>
  );
};

export default AddCategory;
