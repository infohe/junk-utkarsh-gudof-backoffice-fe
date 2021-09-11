import * as React from "react";
import { withStyle } from 'baseui';
import { useMutation, gql, useQuery } from '@apollo/client';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import { Drawer, SIZE } from "baseui/drawer";
import Button from 'components/Button/Button';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import Select from 'components/Select/Select';
import { object } from "yup/lib/locale";



const Col = withStyle(Column, () => ({
    '@media only screen and (max-width: 767px)': {
        marginBottom: '20px',

        ':last-child': {
            marginBottom: 0,
        },
    },
}));

const Row = withStyle(Rows, () => ({
    '@media only screen and (min-width: 768px)': {
        alignItems: 'center',
    },
}));

const GET_CATEGORIES = gql`
query{
  allCategory{
    _id
    image,
    name,
    path,
    products,
    updatedAt
  }
}`;

const CREATE_TEMPLATE = gql`
  mutation createTemplate($template: CreateTemplateInput!) {
    createTemplate(creatTemplateInput: $template) {
      _id,
      name,
      category_id,
      formSchema,
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
            formSchema,
            uiSchema
        }
    }
`;


export default function TemplateCreateDrawer(props) {
    const { state, setState } = props;
    const [schema, setSchema] = React.useState('{}');
    const [uischema, setUiSchema] = React.useState('{}');
    const [options, setOptions] = React.useState({});
    const [category, setCategory] = React.useState('');
    const [categoryDetails,setCategoryDetails]=React.useState([])
    const { data, error, refetch } = useQuery(GET_CATEGORIES);

    const [createTemplate] = useMutation(CREATE_TEMPLATE,
        {
          update(cache, { data: { createTemplate } }) {
            const { allTemplate } = cache.readQuery({
              query: GET_TEMPLATE,
            });
            console.log(createTemplate)
            cache.writeQuery({
              query: GET_TEMPLATE,
              data: { allTemplate: allTemplate.concat([createTemplate]) },
            });
    
          },
          onError(error) {
            console.log(error)
    
          }
        })

    const handleSubmit = () => {
        const newTemplate={
            category_id:categoryDetails[0]._id,
            name:categoryDetails[0].name+'-Template',
            formSchema:schema,
            uiSchema:uischema
        }
        console.log(newTemplate)
        createTemplate({variables:{template:newTemplate}});
        setState(false)
    }

    const handleChange = ({ value }) => {
        console.log(value)
        setCategory(value);
        setCategoryDetails(value)
    };
    React.useEffect(() => {
        setOptions(data);
    }, [data]);
    return (
        <Drawer
            isOpen={state}
            autoFocus
            onClose={() => setState(false)}
            size={SIZE.auto}
        >
            <Grid fluid={true}>
                <Row>
                    <Col md={12}>
                        <Header
                            style={{
                                marginLeft: 0,
                            }}
                        >
                            <Col md={6}>
                                <Heading>Add Template</Heading>
                            </Col>
                        </Header>
                    </Col>
                </Row>
                <Row>
                    <FormFields>
                        <FormLabel>Parent</FormLabel>
                        <Select
                            options={options}
                            labelKey="name"
                            valueKey="_id"
                            placeholder="Ex: Choose parent category"
                            value={category}
                            searchable={false}
                            onChange={handleChange}
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
                </Row>
                <Row>
                    <FormBuilder
                        schema={schema}
                        uischema={uischema}
                        onChange={(newSchema: string, newUiSchema: string) => {
                            setSchema(newSchema);
                            setUiSchema(newUiSchema)
                        }}
                    />
                </Row>
                <Row>
                    <Button
                        onClick={handleSubmit}
                        overrides={{
                            BaseButton: {
                                style: () => ({
                                    width: '100%',
                                    borderTopLeftRadius: '3px',
                                    borderTopRightRadius: '3px',
                                    borderBottomLeftRadius: '3px',
                                    borderBottomRightRadius: '3px',
                                }),
                            },
                        }}
                    >
                        Add Template
                    </Button>
                </Row>
            </Grid>
        </Drawer>
    );
}